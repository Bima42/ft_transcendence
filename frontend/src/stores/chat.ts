import { ref } from 'vue'
import { defineStore } from 'pinia';
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import type IChat from '@/interfaces/chat/IChat'

export const useChatStore = defineStore('chat', () => {
  let currentChatMessages = ref<IChatMessage[]>([]);

  let currentChat = ref<IChat>(null);

  function addMessage(msg: IChatMessage) : void {
    this.currentChatMessages.push(msg);
  }

  return { currentChat, currentChatMessages, addMessage }
})
