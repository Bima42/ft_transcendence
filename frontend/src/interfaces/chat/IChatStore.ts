import type { IUpdateChat } from '@/interfaces/chat/IChat';
import type IChat from '@/interfaces/chat/IChat'
import type { Ref } from 'vue'
import type { UserChatRoleEnum } from '../user/IUserChat';
import type IChatMessage from './IChatMessage';

export default interface IChatStore {
	socket: any;
	currentChat: Ref<IChat | null>;
	chats: Ref<IChat[]>;
	isChatOpen: Ref<Boolean>;
	onNewMessage: (msg: IChatMessage) => void;
	publicChatList: Ref<IChat[]>;
	whisperChatList: Ref<IChat[]>;
	subscribedChannelsList: Ref<IChat[]>;
	notSubscribedChannelsList: Ref<IChat[]>;
	sendMessage: (msg: any) => void;
	refreshCurrentChat: () => Promise<boolean>;
	iAmMutedUntil: (userId: number) => Date;
	setCurrentChat: (chatId: string) => Promise<boolean>;
	retrievePublicChats: () => Promise<boolean>;
	retrieveWhispers: () => Promise<boolean>;
	getRoleFromUserId: (userId: number) => UserChatRoleEnum;
	getMessages: () => Promise<boolean>;
	resetState: () => void;
	deleteChannel: (chatId: number) => Promise<boolean>;
	createChannel: (name: string, type: string, password?: string) => Promise<IChat>;
	createWhisper: (targetUser: string) => Promise<IChat>;
	joinChannel: (chat: IChat, password?: string) => Promise<boolean>;
	leaveChannel: (chatId: number) => Promise<boolean>;
	subscribedChannels: () => Promise<boolean>;
	getListOfNotSubscribedChannels: () => void;
	updateChat: (newData: IUpdateChat) => Promise<IChat>;
	inviteFriendToChat: (userName: string) => Promise<boolean>;
	takeActionOnUser: (userName: string, actionToPerform: string, muteDuration?: number) => Promise<boolean>;
	updateStore: () => Promise<void>;
}
