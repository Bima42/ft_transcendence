import { Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';

@Controller('friends')
@ApiTags('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService
	) {}

	@Post('add/:friendName')
	async addFriend(friendName: string, req: RequestWithUser) {
		return await this.friendsService.addFriend(req.user.id, friendName);
	}

	@Post('remove/:friendName')
	async removeFriend(friendName: string, req: RequestWithUser) {
		return this.friendsService.removeFriend(req.user.id, friendName);
	}

	@Get('is/:friendName')
	async isFriend(friendName: string, req: RequestWithUser) {
		return this.friendsService.isFriend(req.user.id, friendName);
	}

	@Patch('accept/:friendName')
	async acceptFriend(friendName: string, req: RequestWithUser) {
		return this.friendsService.acceptFriend(req.user.id, friendName);
	}

	@Patch('decline/:friendName')
	async declineFriend(friendName: string, req: RequestWithUser) {
		return this.friendsService.declineFriend(req.user.id, friendName);
	}

	@Get('all')
	async getAllFriends(req: RequestWithUser) {
		return this.friendsService.getAllFriends(req.user.id);
	}

	@Get('pending')
	async getAllPendingFriends(req: RequestWithUser) {
		return this.friendsService.getAllPendingFriends(req.user.id);
	}

	@Post('block/:username')
	async blockUser(username: string, req: RequestWithUser) {
		return this.friendsService.blockUser(req.user.id, username);
	}

	@Post('unblock/:username')
	async unblockUser(username: string, req: RequestWithUser) {
		return this.friendsService.unblockUser(req.user.id, username);
	}
}