import { ref } from 'vue'
import { defineStore } from 'pinia';
import type IChatMessage from '@/interfaces/chat/IChatMessage'

export const useChatStore = defineStore('chat', () => {
  const currentChatId = ref(1);
  let currentChatName = ref("Current chat name");
  const currentChatMessages = ref([]);

  function addMessage(msg: IChatMessage) : void {
    console.log("new message in store");
    this.currentChatMessages.push(msg);
    console.log("Array: " + JSON.stringify(this.currentChatMessages));
  }

  return { currentChatId, currentChatName, currentChatMessages, addMessage }
})
