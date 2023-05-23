import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users.service';
import { Friendship, FriendshipStatus } from '@prisma/client';
import { toBlockedDto, toFriendDto } from '../../shared/mapper/user.mapper';
import { BlockedDto, FriendDto, UserDto } from '../dto/user.dto';
import { FriendshipDto } from '../dto/friend.dto';

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

	async getFriendshipStatus(userId: number, otherId: number) : Promise<FriendshipStatus | null> {
		const friendship = await this.prismaService.friendship.findFirst({
			where: {
				OR: [
					{
						userId: userId,
						friendId: otherId,
					},
					{
						userId: otherId,
						friendId: userId,
					}
				]
			},
			select: {
				status: true
			}
		});
		if (!friendship)
			return null;
		return friendship.status
	}

	async isFriend(userId: number, friendId: number): Promise<boolean> {
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

	/**
	 * This function had to check if there is already a pending request for the current user
	 * Also, in frontend, we want to always return the current user as user of the friendship
	 * And the other user as the friend of the friendship, even if it's not the case in db
	 *
	 * @param userId
	 * @param friendName
	 */
	async addFriend(userId: number, friendName: string): Promise<Friendship> {
		const friend = await this.usersService.findByName(friendName);
		if (userId === friend.id)
			throw new BadRequestException('Bro, you are already friends with yourself');
		if (await this.isFriend(userId, friend.id))
			throw new BadRequestException('User is already a friend or has a pending request');

		const friendshipStatus = await this.getFriendshipStatus(userId, friend.id)
		if (!friendshipStatus) {
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

		// If the friendship was canceled, we just update the status to pending
		if (friendshipStatus == "DECLINED" || friendshipStatus == "CANCELED") {
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
		}
		else if (friendshipStatus == "PENDING") {
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
					status: FriendshipStatus.ACCEPTED
				}
			});

		}
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
				],
			}
		});

		if (userId == friendship.friendId) {
			friendship.friendId = friendship.userId;
			friendship.userId = userId;
		}
		return friendship;
	}

	async removeFriend(userId: number, friend: UserDto): Promise<boolean> {
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

	async cancelFriendRequest(userId: number, friendName: string): Promise<Friendship> {
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
	 * @param friend: the user who sent the friend request
	 */
	async acceptFriend(userId: number, friend: UserDto): Promise<FriendshipDto> {
		const friendship = await this.prismaService.friendship.update({
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

		// Change the friendship friendId to friend.id and remove the userId key
		friendship.friendId = friendship.userId;
		delete friendship.userId;
		return friendship;
	}

	async declineFriend(userId: number, friend: UserDto): Promise<Friendship> {
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

	async getAllFriends(userId: number): Promise<FriendDto[]> {
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

	async getAllWaitingRequests(userId: number): Promise<FriendshipDto[]>  {
		return this.prismaService.friendship.findMany({
			where: {
				userId: userId,
				status: FriendshipStatus.PENDING
			},
			select: {
				friendId: true,
				status: true
			}
		});
	}

	async isWaitingRequest(userId: number, friend: UserDto): Promise<boolean> {
		const friendship = await this.prismaService.friendship.findFirst({
			where: {
				userId: userId,
				friendId: friend.id,
				status: FriendshipStatus.PENDING
			}
		});
		return !!friendship;
	}

	async getAllPendingRequests(userId: number): Promise<FriendshipDto[]> {
		const friendships = await this.prismaService.friendship.findMany({
			where: {
				friendId: userId,
				status: FriendshipStatus.PENDING
			},
			select: {
				userId: true,
				status: true
			}
		});

		const response: FriendshipDto[] = [];
		for (const friendship of friendships) {
			response.push({
				friendId: friendship.userId,
				status: friendship.status
			});
		}

		return response;
	}

	async isPendingRequest(userId: number, friendName: string): Promise<boolean> {
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

	async isBlocked(userId: number, blockedUsername: string): Promise<boolean> {
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

		return blocked.blocked.length > 0;
	}

	async blockUser(userId: number, blockedUser: UserDto): Promise<boolean> {

		if (await this.isBlocked(userId, blockedUser.username))
			throw new BadRequestException('User is already blocked');

		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				blocked: {
					connect: [{ id: blockedUser.id }] }
			}
		});

		if (!await this.isBlocked(userId, blockedUser.username))
			throw new InternalServerErrorException('Blocking failed');

		return true;
	}

	async unblockUser(userId: number, blockedUser: UserDto): Promise<boolean> {

		if (!await this.isBlocked(userId, blockedUser.username))
			throw new BadRequestException('User is not blocked');

		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				blocked: {
					disconnect: [{ id: blockedUser.id }] }
			}
		});

		if (await this.isBlocked(userId, blockedUser.username))
			throw new InternalServerErrorException('Unblocking failed');

		return true;
	}

	async getAllBlockedUsers(userId: number): Promise<BlockedDto[]> {
		const users = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { blocked: true }
		});
		return users.blocked.map(toBlockedDto);
	}
}
