import IUser from './IUser'

export default interface IFriendship {
	id: number
	status: FriendshipStatus
	user: IUser
	friend: IUser
}

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED'