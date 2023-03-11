import type IChat from '@/interfaces/chat/IChat';
import type IUser from '@/interfaces/user/IUser';

export default interface IUserChat {
	id: number
	mutedUntil? : Date
	role: UserChatRole
	chat: IChat
	user: IUser
}

export type UserChatRole = 'BANNED' | 'ADMIN' | 'MEMBER'