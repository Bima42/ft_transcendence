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
    status: UserStatus
}
