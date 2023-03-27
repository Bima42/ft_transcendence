import { IsString, IsDefined, Matches, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsAlpha, IsIn, IsPositive } from 'class-validator';
import { ChatType } from '@prisma/client';


export class NewChannelDto {
  @IsNotEmpty()
	name: string;

  @IsEnum(ChatType)
  type: ChatType;

  @IsOptional()
  @IsNotEmpty()
  password?: string;
}

export class DetailedChannelDto {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	users: any; // FIXME TYR: Should be a Dto ?

}

export class UserchatAction {
  @IsNumber()
  chatId: number;

  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  username: string;

  @IsIn(['add', 'kick', 'ban', 'mute', 'promote', 'demote'])
  type: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  muteDuration: number
}
