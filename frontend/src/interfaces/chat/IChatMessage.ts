export default interface IChatMessage {
	id?: number
	content: string
	sentAt?: Date
	updatedAt?: Date
	author: IAuthor
	chatId: number
}

export interface IAuthor {
	id: number,
	username: string,
	avatar: string,
}
