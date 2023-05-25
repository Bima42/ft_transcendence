import { UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUrl,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';

export class CreateUserDto {

	@MinLength(2)
	@MaxLength(20)
	@Matches(/^[a-zA-Z0-9_-]+$/, {message: "Username must contains only letters, numbers or -_"})
	username: string

	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({required: false})
	avatar?: string;

	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({required: false})
	fortyTwoId?: number;

	@MinLength(1)
	@MaxLength(60)
	firstName: string

	@MinLength(1)
	@MaxLength(60)
	lastName: string

	@IsOptional()
	@IsPhoneNumber()
	@ApiProperty({required: false})
	phone?: string
}

export class UpdateUserDto {

	@IsOptional()
	@MinLength(2)
	@MaxLength(20)
	@Matches(/^[a-zA-Z0-9_-]+$/, {message: "Username must contains only letters, numbers or -_"})
	@ApiProperty({required: false})
	username?: string

	@IsOptional()
	@IsEmail()
	@ApiProperty({required: false})
	email?: string

	@IsOptional()
	@IsUrl()
	@ApiProperty({required: false})
	avatar?: string

	@IsOptional()
	@MinLength(1)
	@MaxLength(60)
	@ApiProperty({required: false})
	firstName?: string

	@IsOptional()
	@MinLength(1)
	@MaxLength(60)
	@ApiProperty({required: false})
	lastName?: string

	@IsOptional()
	@IsPhoneNumber()
	@ApiProperty({required: false})
	phone?: string

	@IsOptional()
	@IsEnum(UserStatus)
	@ApiProperty({required: false})
	status?: UserStatus
}

export class UserDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;

	twoFA: boolean;

	@IsEnum(UserStatus)
	status: UserStatus;

	fortyTwoId?: number;
	firstName?: string;
	lastName?: string;
	phone?: string;
	elo: number;
}

export class FriendDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	username: string;

	firstName: string;
	lastName: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
	status: UserStatus;
}

export class BlockedDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
}

export class PlayerStatsDto {
	username: string;
	playedGames: number;
	wonGames: number;
	winRate: number;
	elo: number;
	averageScore: number;
	rank: number;
}

export class EloHistoryDto {
	eloHistory: number[];
	dateHistory: string[];
}

export class MatchHistoryDto {
	opponent: number | string;
	result: string;
	score: string;
	date: Date | string;
}
