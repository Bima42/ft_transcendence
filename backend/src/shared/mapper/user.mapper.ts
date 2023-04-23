import { BlockedDto, FriendDto, UserDto } from '../../users/dto/user.dto';
import { User } from '@prisma/client';

export const toUserDto = (data: User): UserDto => {
	const { id, username, email, avatar, twoFA, status, fortyTwoId, firstName, lastName, phone, elo } = data;
	const userDto: UserDto = {
		id,
		username,
		email,
		avatar,
		twoFA,
		status,
		fortyTwoId,
		firstName,
		lastName,
		phone,
		elo
	};
	return userDto;
}

export const toFriendDto = (data: User | UserDto): FriendDto => {
	const { id, username, firstName, lastName, avatar } = data;
	const friendDto: FriendDto = {
		id,
		username,
		firstName,
		lastName,
		avatar
	};
	return friendDto;
}

export const toBlockedDto = (data: User | UserDto): BlockedDto => {
	const { id, username, avatar } = data;
	const blockedDto: BlockedDto = {
		id,
		username,
		avatar
	};
	return blockedDto;
}
