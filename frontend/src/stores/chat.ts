import { ref } from 'vue'
import { defineStore } from 'pinia'
import type IChat from '@/interfaces/chat/IChat'
import { io, Socket } from 'socket.io-client'
import { getCookie } from 'typescript-cookie'
import { get, jsonHeaders, post, put } from '../../utils'
import type IChatStore from '@/interfaces/chat/IChatStore'
import type ISendMessage from '@/interfaces/chat/ISendMessage'
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import { UserChatRoleEnum } from '@/interfaces/user/IUserChat'
import type IUserChat from '@/interfaces/user/IUserChat'
import type IUserChatAction from '@/interfaces/chat/IUserChatAction';

export const useChatStore = defineStore('chat', (): IChatStore => {
	const socket = ref<Socket>(io(`wss://${import.meta.env.VITE_APP_URL}/chat`, {
		auth: {token: getCookie('access_token')},
		path: '/api/socket.io/',
	}));
	const currentChat = ref<IChat | null>(null);
	const chats = ref<IChat[]>([]);
	const isChatOpen = ref<boolean>(false);
	const publicChatList = ref<IChat[]>([]);
	const whisperChatList = ref<IChat[]>([]);
	const subscribedChannelsList = ref<IChat[]>([]);
	const notSubscribedChannelsList = ref<IChat[]>([]);
	const isChannelPasswordProtected = ref<boolean>(false);

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
				isChatOpen.value = true;
				getMessages()
			})
			.catch((err) => console.log(err));
		await currentChatPasswordProtected()
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
	const retrievePublicChats = async function (): Promise<boolean> {
		await get('chat/rooms/public', 'Cannot load public channels')
			.then((res) => res.json())
			.then((chatList: IChat[]) => {
				publicChatList.value = chatList
			})
			.catch((err) => {
				console.log('ChatStore error: ', err)
				return false
			})
			.finally(() => {
				return true
			});
		return false
	}

	const retrieveWhispers = async function (): Promise<boolean> {
		await get('chat/rooms/whispers', 'Failed to retrieve whispers list')
			.then((res) => res.json())
			.then((chatList: IChat[]) => (
				whisperChatList.value = chatList
			))
			.catch((err) => {
				console.log('ChatStore error: ', err)
				return false
			})
			.finally(() => {
				return true
			});
		return false
	}

	const resetState = () => {
		currentChat.value = null;
		isChatOpen.value = false;
		chats.value = [];
	}

	const createChannel = async function (name: string, type: string, password?: string): Promise<boolean> {
		if (password == ''){
			password = undefined
		}
		await post('chat/rooms', 'Failed to create channel', jsonHeaders, { name, type, password })
			.then((res) => res.json())
			.catch((err) => {
				console.log(err)
				return false
			})
			.finally(() => {
				return true
			})
		return false
	}

	const joinChannel = async function (chat: IChat, password?: string): Promise<boolean> {
		await put('chat/rooms/' + chat.id + '/join', 'Failed to join channel', jsonHeaders, {
			name: chat.name,
			type: chat.type,
			password: password
		})
			.then((res) => res.json())
			.catch((err) => {
				console.log(err)
				return false
			})
			.finally(() => {
				return true
			})
		return false
	}

	const leaveChannel = async function (chatId: string): Promise<boolean> {
		await put('chat/rooms/' + chatId + '/leave', 'Failed to leave channel', jsonHeaders)
			.then((res) => res.json())
			.catch((err) => {
				console.log(err)
				return false
			})
			.finally(() => {
				return true
			})
		return false
	}

	const subscribedChannels = async function (): Promise<boolean> {
		await get('chat/rooms/subscribed', 'Failed to get subscribed channels')
			.then((res) => res.json())
			.then((chatList: IChat[]) => {
				subscribedChannelsList.value = chatList
			})
			.catch((err) => {
				console.log('ChatStore error: ', err)
				return false
			})
			.finally(() => {
				return true
			});
		return false
	}

	const getListOfNotSubscribedChannels = async function () {
		if (!subscribedChannelsList.value.length) {
			await subscribedChannels()
		}
		if (!publicChatList.value.length) {
			await retrievePublicChats()
		}
		notSubscribedChannelsList.value = publicChatList.value.filter((channel) => {
			return !subscribedChannelsList.value.find((subscribedChannel) => {
				return channel.id === subscribedChannel.id
			})
		})
	}

	const changeChatName = async function (newName: string): Promise<boolean> {
		await post('chat/rooms/editChannelName', 'Failed to change channel name', jsonHeaders, { id: currentChat.value?.id, newName: newName })
			.then(() => {
				setCurrentChat(currentChat.value!.id.toString())
				updateStore()
				return true
			}).catch((err) => {
				console.log(err)
				return false
			})
		return false
	}

	const currentChatPasswordProtected = async function (): Promise<void> {
		const response = await get(
			'chat/rooms/' + currentChat.value?.id + '/isPasswordProtected',
			'Failed to get password protection status',
			jsonHeaders
		)
		isChannelPasswordProtected.value = await response.json()
	}

	const inviteFriendToChat = async function (userName: string): Promise<boolean> {
		if (!currentChat.value) {
			return false
		}
		const action: IUserChatAction = {
			chatId: currentChat.value.id,
			username: userName,
			type: 'add'
		}
		let url = `chat/rooms/${currentChat.value.id}/user`;
		await put(url, `cannot add user`, jsonHeaders, action)
			.catch(err => console.error(err))
			.finally(() => {
				updateStore()
			})
		return true
	}

	const takeActionOnUser = async function (userName: string, actionToPerform: string, muteDuration?: number): Promise<boolean> {
		if (!currentChat.value) {
			return false
		}
		if (actionToPerform === 'unban') {
			actionToPerform = 'promote'
		}
		const action: IUserChatAction = {
			chatId: currentChat.value.id,
			username: userName,
			type: actionToPerform,
			muteDuration: muteDuration
		}
		let url = `chat/rooms/${currentChat.value.id}/user`;
		await put(url, `cannot ${actionToPerform} user`, jsonHeaders, action)
			.catch(err => console.error(err))
			.finally(() => {
				updateStore()
			})
		return true
	}

	const updateStore = async function () {
		await retrievePublicChats()
		await retrieveWhispers()
		await subscribedChannels()
		await getListOfNotSubscribedChannels()
		if (currentChat.value) {
			await setCurrentChat(currentChat.value!.id.toString())
		}
	}

	return {
		socket,
		currentChat,
		chats,
		isChatOpen,
		publicChatList,
		whisperChatList,
		subscribedChannelsList,
		notSubscribedChannelsList,
		isChannelPasswordProtected,
		onNewMessage,
		sendMessage,
		setCurrentChat,
		getRoleFromUserId,
		getMessages,
		retrievePublicChats,
		retrieveWhispers,
		resetState,
		createChannel,
		joinChannel,
		leaveChannel,
		subscribedChannels,
		getListOfNotSubscribedChannels,
		changeChatName,
		currentChatPasswordProtected,
		inviteFriendToChat,
		takeActionOnUser,
		updateStore
	}
})
