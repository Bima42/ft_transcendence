export default interface IUserChatAction {
	chatId: number;
	username: string;

	type: string

	muteDuration?: number
}