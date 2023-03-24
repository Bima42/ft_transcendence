<template>
  <div class="chat-input-container">
    <input v-model="msgContent" type="text" placeholder="Type a message..." v-on:keyup.enter="sendMessage">
    <CustomButton @click="sendMessage">Send</CustomButton>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue';
import { post } from '../../../utils';
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/auth';
import type IChatMessage from '@/interfaces/chat/IChatMessage';

const msgContent = ref('');
const chatStore = useChatStore();
const userStore = useUserStore();

async function sendMessage() {
  if (msgContent.value.trim() == "") return;

  // Format: NewMessageDto from back
  const msg = {
    content: msgContent.value,
    senderId: userStore.user?.id,
    chatId: chatStore.currentChat.id,
  };

    chatStore.sendMessage(msg);
    msgContent.value = "";
}
</script>

<style scoped lang="scss">
.chat-input-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;

  input {
    flex: 1;
    height: 30px;
    border: 1px solid yellow;
    background-color: rgb(49, 49, 47);
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 5px;
    color: white;
  }
}
</style>
