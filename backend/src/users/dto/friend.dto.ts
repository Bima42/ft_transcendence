import { FriendshipStatus } from '@prisma/client';

export class FriendshipDto {
	status: FriendshipStatus;
	userId: number;
	friendId: number;
}