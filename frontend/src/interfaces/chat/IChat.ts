import type IChatMessage from '@/interfaces/chat/IChatMessage';
import type IUser from '@/interfaces/user/IUser';
import type IUserChat from '@/interfaces/user/IUserChat';

export default interface IChat {
	id: number
	type: ChatType
	name?: string
	createdAt: Date
	updatedAt: Date
	messages: IChatMessage[]
	users: IUserChat[]
}

export type ChatType = 'PRIVATE' | 'GROUP' | 'GAMECHAT'
