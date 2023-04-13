import { UserDto } from '../../users/dto/user.dto';
import { User } from '@prisma/client';

export const toUserDto = (data: User): UserDto => {
	const { id, username, email, avatar, twoFA, status } = data;
	const userDto: UserDto = {
		id,
		username,
		email,
		avatar,
		twoFA,
		status
	};
	return userDto;
}
