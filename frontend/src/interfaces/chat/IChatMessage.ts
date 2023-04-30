import type IUser from '@/interfaces/user/IUser';
import type IChat from '@/interfaces/chat/IChat';

export default interface IChatMessage {
	id?: number
	content: string
	sentAt?: Date
	updatedAt?: Date
	author: {
    id: number,
    username: string,
    avatar: string,
  }
	chatId: number
}
