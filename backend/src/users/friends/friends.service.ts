import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users.service';
import { FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService
	) {}

	async addFriend(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		return this.prismaService.friendship.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				friend: {
					connect: {
						id: friend.id
					}
				}
			}
		});
	}

	async removeFriend(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		return this.prismaService.friendship.delete({
			where: {
				userId_friendId: {
					userId: userId,
					friendId: friend.id
				}
			}
		});
	}

	async isFriend(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		return this.prismaService.friendship.findFirst({
			where: {
				userId: userId || friend.id,
				friendId: friend.id || userId,
				status: FriendshipStatus.ACCEPTED
			}
		});
	}

	/**
	 * ACCEPT and DECLINE are special cases because userId and friendId are reversed
	 *   - userId in the friendship table is the user who sent the friend request
	 *   - friendId in the friendship table is the user who is accepting or declining the friend request
	 *
	 * @param userId: the user who is accepting or declining the friend request
	 * @param friendName: the user who sent the friend request
	 */
	async acceptFriend(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		return this.prismaService.friendship.update({
			where: {
				userId_friendId: {
					userId: friend.id,
					friendId: userId
				}
			},
			data: {
				status: FriendshipStatus.ACCEPTED
			}
		});
	}

	async declineFriend(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		return this.prismaService.friendship.update({
			where: {
				userId_friendId: {
					userId: friend.id,
					friendId: userId
				}
			},
			data: {
				status: FriendshipStatus.DECLINED
			}
		});
	}

	async getAllFriends(userId: number) {
		return this.prismaService.user.findMany({
			where: {
				friends: {
					some: { userId: userId, status: FriendshipStatus.ACCEPTED },
				},
			},
		});
	}

	async getAllPendingFriends(userId: number) {
		return this.prismaService.user.findMany({
			where: {
				friends: {
					some: { userId: userId, status: FriendshipStatus.PENDING },
				},
			},
		});
	}
}