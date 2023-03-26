<template>
  <section class="chat-wrapper">
    <ChatUserList></ChatUserList>
    <div class="main-box">
      <ChatTopSection></ChatTopSection>
	  <Suspense>
      <ChatWindow></ChatWindow>
	  <template #fallback>
		Messages...
	  </template>
	  </Suspense>
      <TypeBox></TypeBox>
    </div>
  </section>
</template>

<script setup lang="ts">
import ChatUserList from './LeftChatList.vue';
import ChatTopSection from "@/components/chat/ChatTopSection.vue";
import TypeBox from "@/components/chat/TypeBox.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import { onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();

onMounted(async () => {
    // Load the first chat by default
    await chatStore.refreshChatList();
    if (chatStore.chats.length > 0) {
        chatStore.setCurrentChat(chatStore.chats[0]);
    }
});
</script>

<style scoped lang="scss">
.chat-wrapper {
  grid-area: $main;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .main-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 75%;
  }
}
</style>
