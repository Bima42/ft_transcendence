<template>
  <dropdown class="my-dropdown-toggle"
            :options="chatList"
            :selected="currentChatName"
            v-on:updateOption="methodToRunOnSelect"
            :placeholder="currentChatName"
            :closeOnOutsideClick="true">
  </dropdown>
</template>

<script setup lang="ts">

import { get } from '../../../utils'
import { onUpdated, ref } from 'vue'
import dropdown from 'vue-dropdowns';
import { useChatStore } from '@/stores/chat';
import { useModalStore } from '@/stores/modal';
import Modal from "@/components/modal/TheModal.vue";
import ChatPasswordModal from '@/components/modal/ChatPasswordModal.vue';
import type IChat from '@/interfaces/chat/IChat';

let chatStore = useChatStore();
const props = defineProps<{
    chatList: IChat[],
    name: string,
}>();

let currentChatName = ref(props.name);

onUpdated(() => {
    if (props.chatList.length) {
        currentChatName.value = props.chatList[0].name;
    }
});

const modalStore = useModalStore()

async function methodToRunOnSelect(payload: IChat) {

    // Dont do anything if already on the selected chat
    if (chatStore.currentChat && payload.id == chatStore.currentChat.id)
        return;

    const url = 'chat/rooms/' + payload.id
    await get(url, 'Cannot load channel')
        .then((res) => res.json())
        .then((newChannel) => {
            if (newChannel.users)
                chatStore.setCurrentChat(newChannel)
            else {
                newChannel.id = payload.id;
                modalStore.loadAndDisplay(Modal, ChatPasswordModal, newChannel)
            }
        })
        .catch((err) => console.log(err));
}

</script>

<style lang="scss">
.my-dropdown-toggle {
  border-radius: 5px;

    ::v-deep .dropdown-toggle {
      color: tomato;
      font-size: 25px;
      font-weight: 800;
    }

    ::v-deep .dropdown-toggle-placeholder {
      color: #c4c4c4;
    }
}
</style>
