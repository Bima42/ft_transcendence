import { ref } from 'vue'
import { defineStore } from 'pinia';
import type IChat from '@/interfaces/chat/IChat'
import { io, Socket } from "socket.io-client"
import { getCookie } from 'typescript-cookie';
import { get } from '../../utils'
import type IUser from '@/interfaces/user/IUser';

interface IChatStore {
  socket: any;
  currentChat: any;
  groupChats: any;
  whisperChats: any;
  sendMessage: (msg: any) => void;
  setCurrentChatToWhisper: (targetUser: IUser) => Promise<IChat | null>;
  setCurrentChat: (newChat: IChat) => Promise<IChat | null>;
  refreshGroupChatList: () => Promise<IChat[]>;
  refreshWhisperChatList: (user: IUser | null) => Promise<IChat[]>;
}

export const useChatStore = defineStore('chat', (): IChatStore => {
  const socket = ref<Socket>(io(`wss://${import.meta.env.VITE_APP_URL}/chat`, {
    auth: { token: getCookie("access_token") },
    path: "/api/socket.io/",
  }));
  const currentChat = ref<IChat | null>(null);
  const groupChats = ref<IChat[]>([]);
  const whisperChats = ref<IChat[]>([]);

  const sendMessage = function(this: IChatStore, msg: any): void {
    this.socket.emit("msg", msg, (answer: any) => {
      // Handle from here if the server answer something (i.e error)
      // for example 'banned', 'muted', etc.
      console.log("answer = " + JSON.stringify(answer));
    });
  }

  const setCurrentChatToWhisper = async function(this: IChatStore, targetUser: IUser): Promise<IChat | null>{
    console.log(`user = ${JSON.stringify(targetUser)}`)
    // FIXME: get the chat from the server, otherwise we cannot talk to a new user
    // Or dont need a real channel to open the discussion ? Only the user name ?
    const whisperChat = this.whisperChats.find((chat: IChat) => {
    console.log(`chat = ${JSON.stringify(chat)}`)
      if (chat.users?.find((userChat) => {console.log(`id = ${userChat.user.id}, target = ${targetUser.id}`); return userChat.user.id == targetUser.id})) {
        return true
      }
      return false
    })
    console.log(`whisperChat = ${JSON.stringify(whisperChat)}`)
    if (!whisperChat) {
      // Create new whisper chat
      const newChat : IChat = {
        name: "whisper",
        type: "WHISPER",
      }

    }
    if (whisperChat)
      this.setCurrentChat(whisperChat);
    return whisperChat ? whisperChat : null
  }

  const setCurrentChat = async function(this: IChatStore, newChat: IChat): Promise<IChat | null> {
    if (!newChat)
      newChat = this.groupChats[0];
    const url = 'chat/rooms/' + newChat.id;
    await get(url, 'Cannot load channel')
      .then((res) => res.json())
      .then((newChannel) => {
        this.currentChat = newChannel;
      })
      .catch((err) => console.log(err));
    return this.currentChat;
  }

  const refreshGroupChatList = async function(this: IChatStore): Promise<IChat[]> {
    await get('chat/rooms/', 'Cannot load group channel list')
      .then((res) => res.json())
      .then((newList) => {
        this.groupChats = newList;
      })
      .catch((err) => console.log(err));
    return this.groupChats;
  }

  const refreshWhisperChatList = async function(this: IChatStore, user: IUser | null): Promise<IChat[]> {
    await get('chat/whispers/', 'Cannot load whispers list')
      .then((res) => res.json())
      .then((newList) => {
        this.whisperChats = newList;
      })
      .catch((err) => console.log(err));

    if (!user)
      return this.whisperChats;
    // Change chat name to other person name
    this.whisperChats.forEach((el: IChat) => {
      const otherUser = el.users?.find((userChat) => {
        if (userChat.user.id != user?.id) { return true; }
        return false;
      })
      if (otherUser)
        el.name = otherUser.user.username;
    })
    return this.whisperChats;
  }

  return { socket, currentChat, groupChats, whisperChats, sendMessage, setCurrentChatToWhisper, setCurrentChat, refreshGroupChatList, refreshWhisperChatList }
})
