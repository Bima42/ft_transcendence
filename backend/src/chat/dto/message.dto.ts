import { IsString, IsInt } from 'class-validator'

export class NewMessageDto {
  @IsString()
	content: string;

  @IsInt()
  senderId: number;

  @IsInt()
  chatId: number;
}
