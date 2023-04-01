import type IUserChat from '@/interfaces/user/IUserChat';
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import type IFriendship from '@/interfaces/user/IFriendship';
import type IUserGame from '@/interfaces/user/IUserGame';

export default interface IUser {
	id: number
	username: string
	email: string
	avatar: string
	twoFA: boolean
	status: UserStatus
	chats: IUserChat[]
	games: IUserGame[]
	messages: IChatMessage[]
	friendRequest: IFriendship[]
	blockers?: IUser[] // TODO: check if this is needed or not
	blocked: IUser[]
}

export type UserStatus = 'ONLINE' | 'OFFLINE'
