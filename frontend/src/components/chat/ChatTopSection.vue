<template>
  <section class="head-wrap">
    <ChatDropdownMenu :chatList="publicChatList" name="Rooms"></ChatDropdownMenu>
    <h1>{{ currentChatName }}</h1>
    <ChatDropdownMenu :chatList="privateChatList" name="Whispers"></ChatDropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { get } from '../../../utils'
import ChatDropdownMenu from "@/components/chat/ChatDropdownMenu.vue";
import { useChatStore } from '@/stores/chat'

const publicChatList = ref([]);
const privateChatList = ref([]);
const error = ref(null);
const chatStore = useChatStore();

let currentChatName = ref(chatStore.currentChatName);

chatStore.$subscribe((mutation, state) => {
    currentChatName.value = chatStore.currentChat.name;
})

get('chat/rooms', 'Failed to retrieve chat list')
	.then((res) => res.json())
	.then((json) => (publicChatList.value = json))
	.catch((err) => (error.value = err));

// TODO: Retrieve private chats
get('chat/rooms', 'Failed to retrieve whispers list')
	.then((res) => res.json())
	.then((json) => (privateChatList.value = json))
	.catch((err) => (error.value = err));


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
