import type IChatMessage from '@/interfaces/chat/IChatMessage';
import type IUser from '@/interfaces/user/IUser';

export default interface IChat {
	id: number
	type: ChatType
	name?: string
	createdAt: Date
	updatedAt: Date
	messages: IChatMessage[]
	users: IUser[]
}

export type ChatType = 'PRIVATE' | 'GROUP' | 'GAMECHAT'