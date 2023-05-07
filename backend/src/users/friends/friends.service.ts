import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users.service';
import { FriendshipStatus } from '@prisma/client';
import { toBlockedDto, toFriendDto, toUserDto } from '../../shared/mapper/user.mapper';
import { FriendDto, UserDto } from '../dto/user.dto';

@Injectable()
export class FriendsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService
	) {}

	/*************************************************************************
	 *                                                                       *
	 *                               FRIENDS                                 *
	 *                                                                       *
	 *************************************************************************/

	async _isFriendshipCanceled(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		const friendship = await this.prismaService.friendship.findFirst({
			where: {
				OR: [
					{
						userId: userId,
						friendId: friend.id,
					},
					{
						userId: friend.id,
						friendId: userId,
					}
				]
			},
			select: {
				status: true
			}
		});
		if (!friendship)
			return false;
		return friendship.status === FriendshipStatus.CANCELED;
	}

	async isFriend(userId: number, friendId: number) {
		const friendship = await this.prismaService.friendship.findFirst({
			where: {
				OR: [
					{
						userId: userId,
						friendId: friendId,
					},
					{
						userId: friendId,
						friendId: userId,
					},
				],
				status: FriendshipStatus.ACCEPTED
			}
		});
		return !!friendship;
	}

	async addFriend(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		if (await this.isFriend(userId, friend.id))
			throw new BadRequestException('User is already a friend or has a pending request');

		// If the friendship was canceled, we just update the status to pending
		if (await this._isFriendshipCanceled(userId, friendName)) {
			await this.prismaService.friendship.updateMany({
				where: {
					OR: [
						{
							userId: userId,
							friendId: friend.id,
						},
						{
							userId: friend.id,
							friendId: userId,
						}
					],
				},
				data: {
					status: FriendshipStatus.PENDING
				}
			});

			return this.prismaService.friendship.findFirst({
				where: {
					OR: [
						{
							userId: userId,
							friendId: friend.id,
						},
						{
							userId: friend.id,
							friendId: userId,
						}
					],
				}
			});
		}

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
		if (!await this.isFriend(userId, friend.id))
			throw new BadRequestException('User is not a friend or has a pending request');
		const removed = await this.prismaService.friendship.deleteMany({
			where: {
				OR: [
					{
						userId: userId,
						friendId: friend.id,
					},
					{
						userId: friend.id,
						friendId: userId,
					},
				],
			}
		});

		return removed.count > 0;
	}

	async cancelFriendRequest(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		if (!await this.isWaitingRequest(userId, friend))
			throw new BadRequestException('There is no request to cancel');
		return this.prismaService.friendship.update({
			where: {
				userId_friendId: {
					userId: userId,
					friendId: friend.id
				}
			},
			data: {
				status: FriendshipStatus.CANCELED
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
		const friendships = await this.prismaService.friendship.findMany({
			where: {
				OR: [
					{
						userId: userId,
					},
					{
						friendId: userId,
					}
				],
				status: FriendshipStatus.ACCEPTED
			},
			select: {
				userId: true,
				friendId: true
			}
		});

		// Map the friendships to users
		const friends: FriendDto[] = [];
		for (const friendship of friendships) {
			const id = friendship.userId === userId ? friendship.friendId : friendship.userId;
			const user = await this.usersService.findById(id);
			friends.push(toFriendDto(user));
		}

		return friends;
	}

	async getAllWaitingRequests(userId: number) {
		const requests = await this.prismaService.friendship.findMany({
			where: {
				userId: userId,
				status: FriendshipStatus.PENDING
			},
			select: {
				userId: true,
				friendId: true
			}
		});

		const waitingRequests: UserDto[] = [];
		for (const request of requests) {
			const id = request.userId === userId ? request.friendId : request.userId;
			const user = await this.usersService.findById(id);
			waitingRequests.push(toUserDto(user));
		}

		return waitingRequests;
	}

	async isWaitingRequest(userId: number, friend: UserDto) {
		const friendship = await this.prismaService.friendship.findFirst({
			where: {
				userId: userId,
				friendId: friend.id,
				status: FriendshipStatus.PENDING
			}
		});
		return !!friendship;
	}

	async getAllPendingRequests(userId: number) {
		const requests = await this.prismaService.friendship.findMany({
			where: {
				friendId: userId,
				status: FriendshipStatus.PENDING
			},
			select: {
				userId: true,
				friendId: true
			}
		});

		const pendingRequests: UserDto[] = [];
		for (const request of requests) {
			const id = request.userId === userId ? request.friendId : request.userId;
			const user = await this.usersService.findById(id);
			pendingRequests.push(toUserDto(user));
		}

		return pendingRequests;
	}

	async isPendingRequest(userId: number, friendName: string) {
		const friend = await this.usersService.findByName(friendName);
		const friendship = await this.prismaService.friendship.findFirst({
			where: {
				userId: friend.id,
				friendId: userId,
				status: FriendshipStatus.PENDING
			}
		});
		return !!friendship;
	}


	/*************************************************************************
	 *                                                                       *
	 *                             BLOCKED                                   *
	 *                                                                       *
	 *************************************************************************/

	async isBlocked(userId: number, blockedUsername: string) {
		const blockedUser = await this.usersService.findByName(blockedUsername);

		// Find the blockedUser in the blocked list of the user
		const blocked = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: {
				blocked: {
					where: { id: blockedUser.id }
				}
			}
		});

		// Find if the user got the blockedUser in the blockers list
		const blockedBy = await this.prismaService.user.findUnique({
			where: { id: blockedUser.id },
			select: {
				blockers: {
					where: { id: userId }
				}
			}
		});

		return blocked.blocked.length > 0 || blockedBy.blockers.length > 0;
	}

	async blockUser(userId: number, blockedUsername: string) {
		const blockedUser = await this.usersService.findByName(blockedUsername);

		// Check if the user is already blocked
		if (await this.isBlocked(userId, blockedUsername))
			throw new BadRequestException('User is already blocked');

		// Update the blockedUser blockers list
		await this.prismaService.user.update({
			where: { id: blockedUser.id },
			data: {
				blockers: {
					connect: [{ id: userId }]
				}
			}
		});

		// Update the user blocked list
		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				blocked: {
					connect: [{ id: blockedUser.id }] }
			}
		});

		if (!await this.isBlocked(userId, blockedUsername))
			throw new InternalServerErrorException('Blocking failed');

		return true;
	}

	async unblockUser(userId: number, blockedUsername: string) {
		const blockedUser = await this.usersService.findByName(blockedUsername);

		// Check if the user is not blocked
		if (!await this.isBlocked(userId, blockedUsername))
			throw new BadRequestException('User is not blocked');

		// Update the blockedUser blockers list
		await this.prismaService.user.update({
			where: { id: blockedUser.id },
			data: {
				blockers: {
					disconnect: [{ id: userId }]
				}
			}
		});

		// Update the user blocked list
		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				blocked: {
					disconnect: [{ id: blockedUser.id }] }
			}
		});

		if (await this.isBlocked(userId, blockedUsername))
			throw new InternalServerErrorException('Unblocking failed');

		return true;
	}

	async getAllBlockedUsers(userId: number) {
		const users = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { blocked: true }
		});
		return users.blocked.map(toBlockedDto);
	}

	async getAllBlockers(userId: number) {
		const users = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { blockers: true }
		});
		return users.blockers.map(toBlockedDto);
	}

	async canUnblock(userId: number, blockedUsername: string) {
		const blockedUser = await this.usersService.findByName(blockedUsername);
		// Need to check if the blockedUser is in the blocked list of the user
		const blocked = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: {
				blocked: {
					where: { id: blockedUser.id }
				}
			}
		});
		return blocked.blocked.length > 0;
	}
}
