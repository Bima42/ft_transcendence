import { ref } from 'vue'
import { defineStore } from 'pinia';
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import type IChat from '@/interfaces/chat/IChat'
import { io, Socket } from "socket.io-client"
import { getCookie } from 'typescript-cookie';


export const useChatStore = defineStore('chat', () => {
    const socket = ref<Socket>(io("ws://localhost:3080/chat", {
      auth: { token: getCookie("access_token") }}));
    // let currentChatMessages = ref<IChatMessage[]>([]);
    let currentChat = ref<IChat>(null);
    // let chatsList = ref<IChat[]>([]);

     function sendMessage(msg: any): void {
         this.socket.emit("msg", msg);
     }

     function setCurrentChat(newChat: IChat) : IChat{
        this.currentChat = newChat;
       console.log("in set: new value = " + this.currentChat.name);
       return this.currentChat;
     }

    // return { socket, currentChat, currentChatMessages, chatsList, addMessage }
    return { socket, currentChat, sendMessage, setCurrentChat }
})
