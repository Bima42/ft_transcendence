import { IsString, IsInt } from 'class-validator'

export class NewChatMessageDto {
  @IsString()
	content: string;

  @IsInt()
  senderId: number;

  @IsInt()
  chatId: number;
}

export class ChatMessageDto {
  content: string;
  sentAt: Date;
  updatedAt: Date;
  chatId: number;
  user: {
    id: number
    username: string;
    avatar: string;
  }
}
