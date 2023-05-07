import {ref} from 'vue'
import {defineStore} from 'pinia'
import type IChat from '@/interfaces/chat/IChat'
import {io, Socket} from 'socket.io-client'
import {getCookie} from 'typescript-cookie'
import {get} from '../../utils'
import type IChatStore from '@/interfaces/chat/IChatStore'
import type ISendMessage from '@/interfaces/chat/ISendMessage'
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import {UserChatRoleEnum} from '@/interfaces/user/IUserChat'
import type IUserChat from '@/interfaces/user/IUserChat'


export const useChatStore = defineStore('chat', (): IChatStore => {
	const socket = ref<Socket>(io(`wss://${import.meta.env.VITE_APP_URL}/chat`, {
		auth: {token: getCookie('access_token')},
		path: '/api/socket.io/',
	}));
	const currentChat = ref<IChat | null>(null);
	const chats = ref<IChat[]>([]);
	const isChatOpen = ref<boolean>(false);

	const sendMessage = function (this: IChatStore, msg: ISendMessage): void {
		if (!currentChat) return
		this.socket.emit('msg', msg, (answer: any) => {
			// Handle from here if the server answer something (i.e error)
			// for example 'banned', 'muted', etc.
			console.log('answer = ' + JSON.stringify(answer));
		});
	}

	const onNewMessage = function (msg: IChatMessage): void {
		if (!currentChat || msg.chatId != currentChat.value?.id)
			return
		currentChat.value.messages.unshift(msg);
	}

	const setCurrentChat = async function (chatId: string): Promise<boolean> {
		if (!chatId) {
			return false
		}
		const url = 'chat/rooms/' + chatId;
		await get(url, 'Cannot load channel')
			.then((res) => res.json())
			.then((newChannel) => {
				currentChat.value = newChannel;
				getMessages()
			})
			.catch((err) => console.log(err));
		return true
	}

	const getRoleFromUserId = function (userId: number): UserChatRoleEnum {
		const myUserRole = currentChat.value?.users.find((el: IUserChat) => el.user.id == userId)
		if (!myUserRole)
			return UserChatRoleEnum.Unknown
		switch (myUserRole.role) {
			case 'ADMIN':
				return UserChatRoleEnum.Admin
			case 'OWNER':
				return UserChatRoleEnum.Owner
			case 'MEMBER':
				return UserChatRoleEnum.Member
			case 'BANNED':
				return UserChatRoleEnum.Banned
			default:
				return UserChatRoleEnum.Unknown
		}
	}

	// Get the message history
	const getMessages = async function () {
		if (!currentChat.value) return
		isChatOpen.value = true;
		const url = 'chat/rooms/' + currentChat.value.id + '/messages';
		currentChat.value.messages = await get(url, 'Failed to get messages')
			.then((res) => res.json())
			.catch((err) => {
				console.error(err)
			});
	}
	const retrievePublicChats = async function (): Promise<IChat[]> {
		let chats: IChat[] = [];
		await get('chat/rooms', 'Cannot load public channels')
			.then((res) => res.json())
			.then((chatList: IChat[]) => {
				chats = chatList
			})
			.catch((err) => console.log('ChatStore error: ', err));
		return chats;
	}

	const retrieveWhispers = async function (): Promise<IChat[]> {
		let chats: IChat[] = [];
		await get('chat/rooms?whispers=true', 'Failed to retrieve whispers list')
			.then((res) => res.json())
			.then((chatList: IChat[]) => (
				chats = chatList
			))
			.catch((err) => (console.log('ChatStore error: ', err)));
		return chats;
	}

	const resetState = () => {
		currentChat.value = null;
		isChatOpen.value = false;
		chats.value = [];
	}

	return {
		socket,
		currentChat,
		chats,
		isChatOpen,
		onNewMessage,
		sendMessage,
		setCurrentChat,
		getRoleFromUserId,
		getMessages,
		retrievePublicChats,
		retrieveWhispers,
		resetState
	}
})
