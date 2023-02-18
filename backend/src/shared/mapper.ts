import { UserEntity } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

// Function takes a UserEntity object and returns a UserDto object
export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, phoneNumber } = data;
  const userDto: UserDto = {
    id,
    username,
    email,
    phoneNumber,
  };
  return userDto;
};
