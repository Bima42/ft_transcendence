<template>
  <section class="head-wrap">
    <div>
      <ChatDropdownMenu :chatList="publicChatList" name="Rooms" @click="retrievePublicChats"></ChatDropdownMenu>
      <CustomButton id="new-channel" @click="clickHandler">+</CustomButton>
    </div>
    <h1>{{ currentChatName }}</h1>
    <ChatDropdownMenu :chatList="privateChatList" name="Whispers" @click="retrieveWhispers"></ChatDropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { get } from '../../../utils'
import ChatDropdownMenu from "@/components/chat/ChatDropdownMenu.vue";
import CustomButton from "@/components/multiusage/CustomButton.vue";
import { useChatStore } from '@/stores/chat'
import { useModalStore } from "@/stores/modal"
import NewChannelModal from '@/components/modal/NewChannelModal.vue';
import Modal from "@/components/modal/TheModal.vue";
import type IChat from '@/interfaces/chat/IChat'
import { useUserStore } from '@/stores/user';

const publicChatList = ref([]);
const privateChatList = ref([]);
const error = ref(null);
const chatStore = useChatStore();
const userStore = useUserStore();

let currentChatName = chatStore.currentChat ? ref(chatStore.currentChat.name) : ref("Chat name");

chatStore.$subscribe((mutation, state) => {
  if (chatStore.currentChat)
    currentChatName.value = chatStore.currentChat.name;
})

async function retrievePublicChats() {
    await chatStore.refreshGroupChatList();
    publicChatList.value = chatStore.groupChats;
}

// Call it when loading the page
onMounted(async () => {
  await retrievePublicChats();
  retrieveWhispers();
});

async function retrieveWhispers() {
    await chatStore.refreshWhisperChatList(userStore.user);
    privateChatList.value = chatStore.whisperChats;
}

const modalStore = useModalStore()

function clickHandler(e: Event) {
  if (!e.target)
    return
  const target = e.target as HTMLElement
  // TODO: Remove ?
  if (target.id === 'new-channel') {
    modalStore.loadAndDisplay(Modal, NewChannelModal, {})
  }
}

</script>

<style scoped lang="scss">
.head-wrap {
  flex-grow: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;

  h1 {
    color: $yellow;
    justify-self: center;
    align-self: center;
    font-weight: bold;
    font-size: 24px;
  }

  .cascade-menu {
    width: 100px;
    justify-self: center;
    align-self: center;
  }
}
</style>
