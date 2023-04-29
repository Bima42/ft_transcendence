import type IChat from '@/interfaces/chat/IChat'
import type { Ref } from 'vue'

export default interface IChatStore {
	socket: any;
	currentChat: Ref<IChat | null>;
	chats: Ref<IChat[]>;
	isChatOpen: Ref<Boolean>;
	sendMessage: (msg: any) => void;
	setCurrentChat: (chatId: string) => Promise<boolean>;
	retrievePublicChats: () => Promise<IChat[]>;
	retrieveWhispers: () => Promise<IChat[]>;
	getMessages: () => void;
	resetState: () => void;
}