export default interface IUser {
	[key: string]: any
	id: string
	username: string
	twoFA: boolean
	fortyTwoID: number
	email: string
	avatar?: string
	status: UserStatus
	chats: IUserChat[]
	games: IUserGame[]
	messages: IChatMessage[]
	friendRequest: IFriendship[]
	blockers?: IUser[] // TODO: check if this is needed or not
	blocked: IUser[]
}

export type UserStatus = 'ONLINE' | 'OFFLINE'