import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerStatsDto } from '../dto/user.dto';
import { UserStatsService } from './userstats.service';

@Controller('users/stats')
@ApiTags('users/stats')
@ApiBearerAuth('JWT')
export class UserStatsController {
	constructor(
		private readonly userStatsService: UserStatsService
	) {}

	@Get('games/:id')
	async getGamesByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getPlayedGamesByUserId(userId);
	}

	@Get('games/win/:id')
	async getWonGamesByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getWonGamesByUserId(userId);
	}

	@Get('games/winrate/:id')
	async getWinRateByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getWinRateByUserId(userId);
	}

	@Get('games/elo/:id')
	async getEloByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getEloByUserId(userId);
	}

	@Get('leaderboard')
	async getLeaderboard(): Promise<PlayerStatsDto[]> {
		return this.userStatsService.getLeaderboardStats();
	}

	@Get('rank/:id')
	async getRankByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getRankByUserId(userId);
	}

	@Get(':id')
	async getStatsByUserId(@Param('id', ParseIntPipe) userId: number): Promise<PlayerStatsDto> {
		return this.userStatsService.getStatsByUserId(userId);
	}

	@Get('elo/history/:id')
	async getEloHistoryByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getEloHistoryByUserId(userId);
	}

	@Get('elo/highest')
	async getHighestElo(): Promise<number> {
		return this.userStatsService.getHighestElo();
	}

	@Get('matchHistory/:id')
	async getMatchHistoryByUserId(@Param('id', ParseIntPipe) userId: number) {
		return this.userStatsService.getMatchHistoryByUserId(userId);
	}
}