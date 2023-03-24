import { customRef, ref } from 'vue'
import { defineStore } from 'pinia';
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import type IChat from '@/interfaces/chat/IChat'
import { io, Socket } from "socket.io-client"
import { getCookie } from 'typescript-cookie';
import { get } from '../../utils'
import type IUserChat from '@/interfaces/user/IUserChat';


export const useChatStore = defineStore('chat', () => {
  const socket = ref<Socket>(io(`wss://${import.meta.env.VITE_APP_URL}/chat`, {
    auth: { token: getCookie("access_token") },
    path: "/api/socket.io/",
  }));
  let currentChat = ref<IChat | null>(null);
  let chats = ref<IChat[]>([]);

  function sendMessage(msg: any): void {
    this.socket.emit("msg", msg, (answer: any) => {
      // Handle from here if the server answer something (i.e error)
      // for example 'banned', 'muted', etc.
      console.log("answer = " + JSON.stringify(answer));

    });
  }

  async function setCurrentChat(newChat: IChat): IChat {
    const url = 'chat/rooms/' + newChat.id;
    await get(url, 'Cannot load channel')
        .then((res) => res.json())
        .then((newChannel) => {
            this.currentChat = newChannel;
        })
        .catch((err) => console.log(err));
    return this.currentChat;
  }

  async function refreshChatList(): Promise<IChat[]> {
    const url = 'chat/rooms/';
    await get(url, 'Cannot load channel list')
        .then((res) => res.json())
        .then((newList) => {
            this.chats = newList;
        })
        .catch((err) => console.log(err));
    return this.chats;
  }

  function findUserIdFromName(name: string): number | null {
      const users = this.currentChat.users;
      let id = null;
      users.forEach((user: IUserChat)=>{
        if (user.user.username === name) {
          id = user.user.id;
          return;
        }
      });
      return id;

  }

  return { socket, currentChat, chats, sendMessage, setCurrentChat, refreshChatList, findUserIdFromName }
})
