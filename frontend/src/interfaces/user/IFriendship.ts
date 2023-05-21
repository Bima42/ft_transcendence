import type IUser from '@/interfaces/user/IUser';

export default interface IFriendship {
	status: FriendshipStatus
	userId: number
	friendId: number
}

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'NONE'