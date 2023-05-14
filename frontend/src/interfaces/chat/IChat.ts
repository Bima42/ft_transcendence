import type IChatMessage from '@/interfaces/chat/IChatMessage';
import type IUserChat from '@/interfaces/user/IUserChat';

export default interface IChat {
	id: number
	type: ChatType
	name?: string
	password?: string
	createdAt: Date
	updatedAt: Date
	messages: IChatMessage[]
	users: IUserChat[]
}

export interface IUpdateChat {
	id: number
	name?: string
	password?: string
	type?: ChatType
}

export type ChatType = 'PRIVATE' | 'PUBLIC' | 'WHISPER' | 'GAMECHAT'
