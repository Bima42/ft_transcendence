import { Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';
import { UsersService } from '../users.service';
import { ChatGateway } from 'src/chat/channel.gateway';

@Controller('friends')
@ApiTags('Friends')
@ApiBearerAuth('JWT')
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService,
		private readonly usersService: UsersService,
		private readonly channelGateway: ChatGateway,
	) {}

	/*************************************************************************
	 *                                                                       *
	 *                               FRIENDS                                 *
	 *                                                                       *
	 *************************************************************************/

	@Post('add/:friendName')
	@ApiProperty({ type: String })
	async addFriend(@Param('friendName') friendName: string, @Req() req: RequestWithUser) {
		const friendship = await this.friendsService.addFriend(req.user.id, friendName);
		if (friendship.status === 'ACCEPTED') {
			const friendID = req.user.id === friendship.userId ? friendship.friendId : friendship.userId;
			await this.channelGateway.onNewFriend(req.user, friendID);
		}
		return friendship
	}

	@Post('remove/:friendName')
	@ApiProperty({ type: String })
	async removeFriend(@Param('friendName') friendName: string, @Req() req: RequestWithUser) {
		const friend = await this.usersService.findByName(friendName);
		const removed = await this.friendsService.removeFriend(req.user.id, friend);
		await this.channelGateway.onRemoveFriend(req.user, friend.id);
		return removed
	}

	@Post('cancel/:friendName')
	@ApiProperty({ type: String })
	async cancelFriendRequest(@Param('friendName') friendName: string, @Req() req: RequestWithUser) {
		return this.friendsService.cancelFriendRequest(req.user.id, friendName);
	}

	@Get('is/:friendName')
	@ApiProperty({ type: String })
	async isFriend(@Param('friendName') friendName: string, @Req() req: RequestWithUser): Promise<boolean> {
		const friend = await this.usersService.findByName(friendName);
		return this.friendsService.isFriend(req.user.id, friend.id);
	}

	@Patch('accept/:friendName')
	@ApiProperty({ type: String })
	async acceptFriend(@Param('friendName') friendName: string, @Req()  req: RequestWithUser) {
		const friend = await this.usersService.findByName(friendName);
		const friendship = await this.friendsService.acceptFriend(req.user.id, friend);
		await this.channelGateway.onNewFriend(req.user, friend.id);
		return friendship;
	}

	@Patch('decline/:friendName')
	@ApiProperty({ type: String })
	async declineFriend(@Param('friendName') friendName: string, @Req() req: RequestWithUser) {
		return this.friendsService.declineFriend(req.user.id, friendName);
	}

	@Get('all')
	async getAllFriends(@Req() req: RequestWithUser) {
		return this.friendsService.getAllFriends(req.user.id);
	}

	@Get('waiting')
	async getAllWaitingRequests(@Req() req: RequestWithUser) {
		return this.friendsService.getAllWaitingRequests(req.user.id);
	}

	@Get('isWaiting/:username')
	@ApiProperty({ type: String })
	async isWaiting(@Param('username') username: string, @Req() req: RequestWithUser) {
		const friend = await this.usersService.findByName(username);
		return this.friendsService.isWaitingRequest(req.user.id, friend);
	}

	@Get('pending')
	async getAllPendingRequests(@Req() req: RequestWithUser) {
		return this.friendsService.getAllPendingRequests(req.user.id);
	}

	@Get('isPending/:username')
	@ApiProperty({ type: String })
	async isPending(@Param('username') username: string, @Req() req: RequestWithUser) {
		return this.friendsService.isPendingRequest(req.user.id, username);
	}

	/*************************************************************************
	 *                                                                       *
	 *                           BLOCKED                                     *
	 *                                                                       *
	 *************************************************************************/

	@Get('isBlocked/:username')
	@ApiProperty({ type: String })
	async isBlocked(@Param('username') username: string, @Req() req: RequestWithUser) {
		return this.friendsService.isBlocked(req.user.id, username);
	}

	@Post('block/:username')
	@ApiProperty({ type: String })
	async blockUser(@Param('username') username: string, @Req() req: RequestWithUser) {
		const blockedUser = await this.usersService.findByName(username);
		const res = await this.friendsService.blockUser(req.user.id, blockedUser);
		await this.channelGateway.onBlockUser(req.user, blockedUser.id)
		return res
	}

	@Post('unblock/:username')
	@ApiProperty({ type: String })
	async unblockUser(@Param('username') username: string, @Req()  req: RequestWithUser) {
		const blockedUser = await this.usersService.findByName(username);
		const res = await this.friendsService.unblockUser(req.user.id, blockedUser);
		await this.channelGateway.onUnblockUser(req.user, blockedUser.id)
		return res
	}

	@Get('blocked')
	async getAllBlockedUsers(@Req() req: RequestWithUser) {
		return this.friendsService.getAllBlockedUsers(req.user.id);
	}
}
