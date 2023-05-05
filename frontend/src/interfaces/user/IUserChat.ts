import type IChat from '@/interfaces/chat/IChat';
import type IUser from '@/interfaces/user/IUser';

export default interface IUserChat {
	mutedUntil? : Date
	role: UserChatRole
	chat: IChat
	user: IUser
}

export type UserChatRole = 'BANNED' | 'ADMIN' | 'MEMBER' | 'OWNER'
export const enum UserChatRoleEnum {
  Banned = -1,
  Unknown = 0,
  Member = 1,
  Admin = 2,
  Owner = 3
}
