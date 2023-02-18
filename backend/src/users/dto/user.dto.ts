import { IsNotEmpty, IsEmail } from 'class-validator';

// Used when you want to return the User information
// without the password field (for security reasons)
export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;
}
