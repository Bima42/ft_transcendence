import { UserEntity } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

// Function takes a UserEntity object and returns a UserDto object
export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;
  const userDto: UserDto = {
    id,
    username,
    email,
  };
  return userDto;
};
