import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerStatsDto } from '../dto/user.dto';

@Injectable()
export class UserStatsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	private _formatDate(dateToFormat: Date) {
		const date = new Date(dateToFormat);
		const day = date.getDate().toString().padStart(2, '0');
		const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}

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

	async getEloHistoryByUserId(userId: number) {
		const games = await this.prismaService.userGame.findMany({
			where: {
				userId: userId
			},
			select: {
				elo: true,
				game: {
					select: {
						createdAt: true
					}
				}
			}
		});
		const eloHistory: number[] = [];
		const dateHistory: string[] = [];
		for (const game of games) {
			eloHistory.push(game.elo);
			dateHistory.push(this._formatDate(game.game.createdAt));
		}

		// Insert the current elo of the user as last elo
		const currentElo = await this.getEloByUserId(userId);
		eloHistory.push(currentElo);

		// Insert a copy of the last date as last date
		dateHistory.push(dateHistory[dateHistory.length - 1]);

		if (eloHistory.length > 20)
			eloHistory.splice(0, eloHistory.length - 20);
		if (dateHistory.length > eloHistory.length)
			dateHistory.splice(0, dateHistory.length - eloHistory.length);

		return {
			eloHistory: eloHistory,
			dateHistory: dateHistory
		}
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
		return {
			username: username,
			playedGames: playedGames,
			wonGames: wonGames,
			winRate: winRate,
			averageScore: averageScore,
			elo: elo,
		}
	}

	async getLeaderboardStats(): Promise<PlayerStatsDto[]> {
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

	async getHighestElo(): Promise<number> {
		const users = await this.prismaService.user.findMany();
		let highestElo = 0;
		for (const user of users) {
			const elo = await this.getEloByUserId(user.id);
			if (elo > highestElo)
				highestElo = elo;
		}
		return highestElo;
	}

	async getMatchHistoryByUserId(userId: number) {
		const games = await this.prismaService.userGame.findMany({
			where: {
				userId: userId
			},
			select: {
				gameId: true,
				win: true,
				score: true,
				game: {
					select: {
						createdAt: true
					}
				}
			}
		});

		// Iter each userGame and get game datas (opponentId, result, score, date)
		const matchHistory: {
			opponent: number | string,
			result: string,
			score: string,
			date: Date | string
		}[] = [];

		for (const game of games) {
			const opponent = await this.prismaService.userGame.findFirst({
				where: {
					gameId: game.gameId,
					userId: {
						not: userId
					}
				},
				select: {
					userId: true,
					score: true
				}
			});

			matchHistory.push({
				opponent: opponent.userId,
				result: game.win === 1 ? "Victory" : "Defeat",
				score: `${game.score} - ${opponent.score}`,
				date: game.game.createdAt
			});
		}

		// Replace each opponentId by the username of the opponent and change the date format
		for (const match of matchHistory) {
			if (typeof match.opponent === "number") {
				const { username } = await this.prismaService.user.findUnique({
					where: {
						id: match.opponent
					},
					select: {
						username: true
					}
				});
				match.opponent = username;
			}

			match.date = this._formatDate(match.date as Date);
		}

		return matchHistory;
	}
}
