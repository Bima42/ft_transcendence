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
	isChannelPasswordProtected: Ref<boolean>;
	sendMessage: (msg: any) => void;
	setCurrentChat: (chatId: string) => Promise<boolean>;
	retrievePublicChats: () => Promise<IChat[]>;
	retrieveWhispers: () => Promise<IChat[]>;
	getRoleFromUserId: (userId: number) => Promise<UserChatRoleEnum>;
	getMessages: () => void;
	resetState: () => void;
	createChannel: (name: string, type: string, password?: string) => Promise<boolean>;
	createWhisper: (targetUser: string) => Promise<boolean>;
	joinChannel: (chat: IChat, password?: string) => Promise<boolean>;
	leaveChannel: (chatId: string) => Promise<boolean>;
	subscribedChannels: () => Promise<boolean>;
	getListOfNotSubscribedChannels: () => void;
	changeChatName: (newName: string) => Promise<boolean>;
	currentChatPasswordProtected: (id: string) => Promise<boolean>;
	inviteFriendToChat: (userName: string) => Promise<boolean>;
	takeActionOnUser: (userName: string, actionToPerform: string, muteDuration?: number) => Promise<boolean>;
	updateStore: () => Promise<void>;
}
