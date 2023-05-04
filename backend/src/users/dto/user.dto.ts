import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

  @IsOptional()
  @Matches(/^[a-zA-Z0-9_-]{2,20}$/)
  @ApiProperty({ required: false })
  username?: string

  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false })
  email?: string

  @IsOptional()
  @MinLength(1)
  @MaxLength(60)
  @ApiProperty({ required: false })
  firstName?: string

  @IsOptional()
  @MinLength(1)
  @MaxLength(60)
  @ApiProperty({ required: false })
  lastName?: string

  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({ required: false })
  phone?: string
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
}
