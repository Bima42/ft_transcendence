import { ref } from 'vue'
import { defineStore } from 'pinia';
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import type IChat from '@/interfaces/chat/IChat'
import { io } from "socket.io-client"

export const useChatStore = defineStore('chat', () => {
    const socket = ref(io("ws://localhost:3080/chat"));
    let currentChatMessages = ref<IChatMessage[]>([]);
    let currentChat = ref<IChat>(null);
    let chatsList = ref<IChat[]>([]);

    function addMessage(msg: IChatMessage): void {
        this.currentChatMessages.push(msg);
    }

    return { socket, currentChat, currentChatMessages, chatsList, addMessage }
})
