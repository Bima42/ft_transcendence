import type IUser from '@/interfaces/user/IUser';

export default interface IFriendship {
	id: number
	status: FriendshipStatus
	user: IUser
	friend: IUser
}

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'NONE'