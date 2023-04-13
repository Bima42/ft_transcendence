import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';

@Controller('friends')
@ApiTags('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService
	) {}
}