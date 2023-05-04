import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerStatsDto } from '../dto/user.dto';

@Injectable()
export class UserStatsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async getPlayedGamesByUserId(userId: number) {
		return this.prismaService.userGame.count({
			where: {
				userId: userId
			}
		});
	}

	async getWonGamesByUserId(userId: number) {
		return this.prismaService.userGame.count({
			where: {
				userId: userId,
				win: 1
			}
		});
	}

	async getWinRateByUserId(userId: number) {
		const playedGames = await this.getPlayedGamesByUserId(userId);
		const winGames = await this.getWonGamesByUserId(userId);
		if (playedGames === 0 || winGames === 0)
			return 0;
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

	async getAverageScoreByUserId(userId: number) {
		const scores = await this.prismaService.userGame.findMany({
			where: {
				id: userId
			},
			select: {
				score: true
			}
		});
		let totalScore = 0;
		for (const score of scores) {
			totalScore += score.score;
		}
		const playedGames = await this.getPlayedGamesByUserId(userId);
		return totalScore / playedGames;
	}

	async getEloHistoryByUserId(userId: number): Promise<number[]> {
		const games = await this.prismaService.userGame.findMany({
			where: {
				userId: userId
			},
			select: {
				elo: true
			}
		});
		const eloHistory = [];
		for (const game of games) {
			eloHistory.push(game.elo);
		}
		return eloHistory;
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
		const averageScore = await this.getAverageScoreByUserId(userId);
		const eloHistory = await this.getEloHistoryByUserId(userId);
		return {
			username: username,
			playedGames: playedGames,
			wonGames: wonGames,
			winRate: winRate,
			elo: elo,
			eloHistory: eloHistory,
			averageScore: averageScore,
		}
	}

	async getAllStatsForAllUsers(): Promise<PlayerStatsDto[]> {
		const users = await this.prismaService.user.findMany();
		const stats = [];
		for (const user of users) {
			const userStats = await this.getStatsByUserId(user.id);
			delete userStats.wonGames;
			stats.push(userStats);
		}
		stats.sort((a, b) => b.elo - a.elo);

		return stats;
	}
}