import { Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';
import { UsersService } from '../users.service';

@Controller('friends')
@ApiTags('Friends')
@ApiBearerAuth('JWT')
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService,
		private readonly usersService: UsersService,
	) {}

	/*************************************************************************
	 *                                                                       *
	 *                               FRIENDS                                 *
	 *                                                                       *
	 *************************************************************************/

	@Post('add/:friendName')
	@ApiProperty({ type: String })
	async addFriend(@Param('friendName') friendName: string, @Req() req: RequestWithUser) {
		return await this.friendsService.addFriend(req.user.id, friendName);
	}

	@Post('remove/:friendName')
	@ApiProperty({ type: String })
	async removeFriend(@Param('friendName') friendName: string, @Req() req: RequestWithUser) {
		return this.friendsService.removeFriend(req.user.id, friendName);
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
		return this.friendsService.acceptFriend(req.user.id, friendName);
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
		return this.friendsService.blockUser(req.user.id, username);
	}

	@Post('unblock/:username')
	@ApiProperty({ type: String })
	async unblockUser(@Param('username') username: string, @Req()  req: RequestWithUser) {
		return this.friendsService.unblockUser(req.user.id, username);
	}

	@Get('blocked')
	async getAllBlockedUsers(@Req() req: RequestWithUser) {
		return this.friendsService.getAllBlockedUsers(req.user.id);
	}

	@Get('blockers')
	async getAllBlockers(@Req() req: RequestWithUser) {
		return this.friendsService.getAllBlockers(req.user.id);
	}

	@Get('can/unblock/:username')
	@ApiProperty({ type: String })
	async canUnblock(@Param('username') username: string, @Req() req: RequestWithUser) {
		return this.friendsService.canUnblock(req.user.id, username);
	}
}
