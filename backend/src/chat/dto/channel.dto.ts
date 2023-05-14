import { IsString, IsDefined, Matches, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsAlpha, IsIn, IsPositive, MaxLength } from 'class-validator';
import { ChatType, UserChatRole } from '@prisma/client';
import { UserDto } from 'src/users/dto/user.dto';


export class NewWhisperDto {
	@IsString()
	@IsNotEmpty()
	targetUsername: string;
}

export class NewChannelDto {

	@IsNotEmpty()
	@MaxLength(60)
	name: string;

	@IsEnum(ChatType)
	type: ChatType;

	@IsOptional()
	password?: string;
}

export class UpdateChannelDto {
	@IsNumber()
	@IsPositive()
	id: number

	@IsOptional()
	@IsNotEmpty()
	@MaxLength(60)
	name: string;

	@IsOptional()
	@IsEnum(ChatType)
	type: ChatType;

	@IsOptional()
	password?: string;
}

export class JoinChannelDto {
	@IsNumber()
	@IsPositive()
	chatId: number

	@IsOptional()
	password?: string
}

export class BriefChannelDto {

	@IsNumber()
	@IsPositive()
	id: number

	@IsNotEmpty()
	name: string;

	@IsEnum(ChatType)
	type: ChatType;

	@IsOptional()
	password?: string;
}

export class DetailedChannelDto {
	id: number;
	type: ChatType;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	users: {
		userId: number
		chatId: number,
		role: UserChatRole,
		mutedUntil: Date,
		user: UserDto,
	}[];

}

export class UserchatAction {
	@IsNumber()
	@IsPositive()
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
