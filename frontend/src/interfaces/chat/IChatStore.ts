import type IChat from '@/interfaces/chat/IChat'
import type {Ref} from 'vue'
import type {UserChatRoleEnum} from '../user/IUserChat';
import type IChatMessage from './IChatMessage';

export default interface IChatStore {
	socket: any;
	currentChat: Ref<IChat | null>;
	chats: Ref<IChat[]>;
	isChatOpen: Ref<Boolean>;
	onNewMessage: (msg: IChatMessage) => void;
	sendMessage: (msg: any) => void;
	setCurrentChat: (chatId: string) => Promise<boolean>;
	retrievePublicChats: () => Promise<IChat[]>;
	retrieveWhispers: () => Promise<IChat[]>;
	getRoleFromUserId: (userId: number) => Promise<UserChatRoleEnum>;
	getMessages: () => void;
	resetState: () => void;
}
