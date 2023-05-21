import type IUser from '@/interfaces/user/IUser';

export default interface IFriendship {
	status: FriendshipStatus
	user: number
	friend: number
}

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'NONE'