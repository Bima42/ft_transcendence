import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from '@prisma/client';

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
}
