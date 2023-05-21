export default interface IFriendship {
	status: FriendshipStatus
	friendId: number
}

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'NONE'