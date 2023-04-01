import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UserDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(UserStatus)
    status: string;

    twoFA: boolean;

    twoFAAuthenticated: boolean;
}
