import { ref } from 'vue'
import { defineStore } from 'pinia'
import type IChat from '@/interfaces/chat/IChat'
import { io, Socket } from 'socket.io-client'
import { getCookie } from 'typescript-cookie'
import { get, jsonHeaders, post, put, patch, del } from '../../utils'
import type IChatStore from '@/interfaces/chat/IChatStore'
import type ISendMessage from '@/interfaces/chat/ISendMessage'
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import { UserChatRoleEnum } from '@/interfaces/user/IUserChat'
import type IUserChat from '@/interfaces/user/IUserChat'
import type IUserChatAction from '@/interfaces/chat/IUserChatAction'
import type { IUpdateChat } from '@/interfaces/chat/IChat'
import { useAlertStore } from '@/stores/alert'

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
	const alertStore = useAlertStore()

	const sendMessage = function (this: IChatStore, msg: ISendMessage): void {
		if (!currentChat.value) return
		this.socket.emit('msg', msg, (answer: any) => {
			// Handle from here if the server answer something (i.e error)
			// for example 'banned', 'muted', etc.
			console.log('answer = ' + JSON.stringify(answer));
		});
	}
	const onNewMessage = function (msg: IChatMessage): void {
		if (!currentChat.value || msg.chatId != currentChat.value?.id)
			return
		currentChat.value.messages.unshift(msg);
	}

	const refreshCurrentChat = async function (): Promise<boolean> {
		if (!currentChat.value)
			return false
		currentChat.value = await get(`chat/rooms/${currentChat.value.id}`, 'Failed to refresh chat').catch((err) => {
			alertStore.setErrorAlert(err)
			return false
		})
		return true
	}

	const iAmMutedUntil = function (userId: number): Date | null {
		const userChat = currentChat.value?.users.find(el => { return el.user.id === userId })
		if (userChat?.mutedUntil)
			return userChat.mutedUntil
		return null
	}

	const setCurrentChat = async function (chatId: string): Promise<boolean> {
		if (!chatId) return false
		const url = 'chat/rooms/' + chatId;
		await get(url, 'Cannot load channel').then((newChannel) => {
			currentChat.value = newChannel;
			isChatOpen.value = true;
			getMessages()
		}).catch((err) => {
			alertStore.setErrorAlert(err)
			return false
		})
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
	const getMessages = async function (): Promise<boolean> {
		if (!currentChat.value) return false
		isChatOpen.value = true;
		const url = 'chat/rooms/' + currentChat.value.id + '/messages';
		currentChat.value.messages = await get(url, 'Failed to get messages').catch((err) => {
			alertStore.setErrorAlert(err)
			return []
		})
		return true
	}
	const retrievePublicChats = async function (): Promise<boolean> {
		await get('chat/rooms/public', 'Cannot load public channels')
			.then((chatList: IChat[]) => {
				publicChatList.value = chatList
			}).catch((err) => {
				alertStore.setErrorAlert(err)
				return false
			}).finally(() => {
				return true
			})
		return false
	}

	const retrieveWhispers = async function (): Promise<boolean> {
		await get('chat/rooms/whispers', 'Failed to retrieve whispers list')
			.then((chatList: IChat[]) => (
				whisperChatList.value = chatList
			)).catch((err) => {
				alertStore.setErrorAlert(err)
			}).finally(() => {
				return true
			});
		return false
	}

	const resetState = () => {
		currentChat.value = null;
		isChatOpen.value = false;
		chats.value = [];
	}

	const createChannel = async function (name: string, type: string, password?: string): Promise<IChat> {
		if (password == '') {
			password = undefined
		}
		const retChat = await post('chat/rooms', 'Failed to create channel', jsonHeaders, {name, type, password})
			.catch((err) => {
				alertStore.setErrorAlert(err)
				return null
			})
		return retChat
	}

	const createWhisper = async function (targetUsername: string): Promise<IChat> {
		const chat = await post('chat/rooms/whispers', 'Failed to create whisper', jsonHeaders, {targetUsername})
			.catch((err) => {
				alertStore.setErrorAlert(err)
				return null
			})
		return chat
	}

	const joinChannel = async function (chat: IChat, password?: string): Promise<boolean> {
		return await put('chat/rooms/join', 'Failed to join channel', jsonHeaders, {
			chatId: chat.id,
			password: password || undefined
		}).then(() => {
			return true
		}).catch((err) => {
			alertStore.setErrorAlert(err)
			return false
		})
	}

	const deleteChannel = async function (chatId: number): Promise<boolean> {
		await del(`chat/rooms/${chatId}`, 'Cannot delete channel').catch((err) => {
			alertStore.setErrorAlert(err)
			return false
		})
		subscribedChannelsList.value.splice(subscribedChannelsList.value.findIndex(e => e.id === chatId), 1)
		return true
	}

	const leaveChannel = async function (chatId: number = (currentChat.value?.id || 0)): Promise<boolean> {
		await put('chat/rooms/leave', 'Failed to leave channel', jsonHeaders, {chatId: chatId})
			.then((_res) => {
				subscribedChannelsList.value.splice(subscribedChannelsList.value.findIndex(e => e.id === chatId), 1)
			}).catch((err) => {
				alertStore.setErrorAlert(err)
				return false
			})
		await subscribedChannels()
		return true
	}

	const subscribedChannels = async function (): Promise<boolean> {
		get('chat/rooms/subscribed', 'Failed to get subscribed channels')
			.then((chatList: IChat[]) => {
				subscribedChannelsList.value = chatList
			}).catch((err) => {
				alertStore.setErrorAlert(err)
				return false
			}).finally(() => {
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

	const updateChat = async function (newData: IUpdateChat): Promise<IChat> {
		const newChat = await patch('chat/rooms/', 'Failed to update channel', jsonHeaders, newData)
			.catch((err) => {
				alertStore.setErrorAlert(err)
				return null
			})
		if (newChat)
			currentChat.value = newChat
		updateStore()
		return newChat
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
		const url = `chat/rooms/${currentChat.value.id}/user`;
		await put(url, `cannot add user`, jsonHeaders, action).catch((err) => {
			alertStore.setErrorAlert(err)
			return false
		})
		await updateStore()
		return true
	}

	const takeActionOnUser = async function (userName: string, actionToPerform: string, muteDuration?: number): Promise<boolean> {
		if (!currentChat.value) {
			return false
		}
		if (actionToPerform === 'unban') {
			actionToPerform = 'add'
		}
		const action: IUserChatAction = {
			chatId: currentChat.value.id,
			username: userName,
			type: actionToPerform,
			muteDuration: muteDuration
		}
		const url = `chat/rooms/${currentChat.value.id}/user`;
		await put(url, `cannot ${actionToPerform} user`, jsonHeaders, action).catch((err) => {
			alertStore.setErrorAlert(err)
			return false
		})
		await updateStore()
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
		onNewMessage,
		sendMessage,
		refreshCurrentChat,
		iAmMutedUntil,
		setCurrentChat,
		getRoleFromUserId,
		getMessages,
		retrievePublicChats,
		retrieveWhispers,
		resetState,
		createChannel,
		deleteChannel,
		createWhisper,
		joinChannel,
		leaveChannel,
		subscribedChannels,
		getListOfNotSubscribedChannels,
		updateChat,
		inviteFriendToChat,
		takeActionOnUser,
		updateStore
	}
})
