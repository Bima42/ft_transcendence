import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerStatsDto } from '../dto/user.dto';

@Injectable()
export class UserStatsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async getPlayedGamesByUserId(userId: number) {
		const playedGames = this.prismaService.userGame.findMany({
			where: {
				userId: userId
			}
		});

		return playedGames.then((games) => games.length);
	}

	async getWonGamesByUserId(userId: number) {
		const winGames = this.prismaService.userGame.findMany({
			where: {
				userId: userId,
				win: 1
			}
		});

		return winGames.then((games) => games.length);
	}

	async getWinRateByUserId(userId: number) {
		const playedGames = await this.getPlayedGamesByUserId(userId);
		const winGames = await this.getWonGamesByUserId(userId);
		return winGames / playedGames * 100;
	}

	async getEloByUserId(userId: number) {
		const { elo } = await this.prismaService.user.findUnique({
			where: {
				id: userId
			},
			select: {
				elo: true
			}
		});
		return elo;
	}

	async getStatsByUserId(userId: number): Promise<PlayerStatsDto> {
		const { username } = await this.prismaService.user.findUnique({
			where: {
				id: userId
			},
			select: {
				username: true
			}
		});
		const playedGames = await this.getPlayedGamesByUserId(userId);
		const wonGames = await this.getWonGamesByUserId(userId);
		const winRate = await this.getWinRateByUserId(userId);
		const elo = await this.getEloByUserId(userId);
		return {
			username: username,
			playedGames: playedGames,
			wonGames: wonGames,
			winRate: winRate,
			elo: elo
		}
	}
}