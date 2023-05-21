import { FriendshipStatus } from '@prisma/client';

export class FriendshipDto {
	status: FriendshipStatus;
	friendId: number;
}