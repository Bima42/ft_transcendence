import { ref } from 'vue'
import { defineStore } from 'pinia';
import type IChat from '@/interfaces/chat/IChat'
import { io, Socket } from "socket.io-client"
import { getCookie } from 'typescript-cookie';
import { get } from '../../utils'

export const useChatStore = defineStore('chat', () => {
  const socket = ref<Socket>(io(`wss://${import.meta.env.VITE_APP_URL}/chat`, {
    auth: { token: getCookie("access_token") },
    path: "/api/socket.io/",
  }));
  const currentChat = ref<IChat | null>(null);
  const chats = ref<IChat[]>([]);

  const sendMessage = function(this: any, msg: any): void {
    this.socket.emit("msg", msg, (answer: any) => {
      // Handle from here if the server answer something (i.e error)
      // for example 'banned', 'muted', etc.
      console.log("answer = " + JSON.stringify(answer));
    });
  }

  const setCurrentChat = async function(this: any, newChat: IChat): Promise<IChat | null> {
    if (!newChat)
      newChat = this.chats[0];
    const url = 'chat/rooms/' + newChat.id;
    await get(url, 'Cannot load channel')
        .then((res) => res.json())
        .then((newChannel) => {
            this.currentChat = newChannel;
        })
        .catch((err) => console.log(err));
    return this.currentChat;
  }

  const refreshChatList = async function (this: any): Promise<IChat[]> {
    const url = 'chat/rooms/';
    await get(url, 'Cannot load channel list')
        .then((res) => res.json())
        .then((newList) => {
            this.chats = newList;
        })
        .catch((err) => console.log(err));
    return this.chats;
  }

  return { socket, currentChat, chats, sendMessage, setCurrentChat, refreshChatList }
})
