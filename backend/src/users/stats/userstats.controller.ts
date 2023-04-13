import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { PlayerStatsDto } from '../dto/user.dto';
import { UserStatsService } from './userstats.service';

@Controller('user/stats')
@ApiTags('user/stats')
@UseGuards(JwtAuthGuard)
export class UserStatsController {
	constructor(
		private readonly userStatsService: UserStatsService
	) {}

	@Get('stats/games/:id')
	async getGamesByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getPlayedGamesByUserId(userId);
	}

	@Get('stats/games/win/:id')
	async getWonGamesByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getWonGamesByUserId(userId);
	}

	@Get('stats/games/winrate/:id')
	async getWinRateByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getWinRateByUserId(userId);
	}

	@Get('stats/games/elo/:id')
	async getEloByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getEloByUserId(userId);
	}

	@Get('stats/:id')
	async getStatsByUserId(@Param('id', ParseIntPipe) userId: number): Promise<PlayerStatsDto> {
		return this.userStatsService.getStatsByUserId(userId);
	}
}