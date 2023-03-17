<template>
  <div class="chat-input-container">
    <input v-model="msgContent" type="text" placeholder="Type a message...">
    <CustomButton @click="sendMessage">Send</CustomButton>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue';
import { post } from '../../../utils';
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import type IChatMessage from '@/interfaces/chat/IChatMessage';

const msgContent = ref('');
const chatStore = useChatStore();
const userStore = useAuthStore();

async function sendMessage() {
  if (msgContent.value.trim() == "") return;

  const msg: IChatMessage = {
    content: msgContent.value,
    user: userStore.user.username,
    chat: chatStore.currentChat,
  };

  const url = "chat/rooms/" + chatStore.currentChat.id + "/messages";
  const response = await post(url, 'Cannot send message', msg)
    .then(response => response.json())
    .then(json => {
      console.log("response = " + json);
      console.log("response2 = " + JSON.stringify(json));
      chatStore.addMessage(msg);
      msgContent.value = "";
    })
    .catch(error => console.log(error));
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
