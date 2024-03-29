import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EloHistoryDto, MatchHistoryDto, PlayerStatsDto } from '../dto/user.dto';

@Injectable()
export class UserStatsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	private _formatDate(dateToFormat: Date): string {
		const date = new Date(dateToFormat);
		const day = date.getDate().toString().padStart(2, '0');
		const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}

	async getPlayedGamesByUserId(userId: number): Promise<number> {
		return this.prismaService.userGame.count({
			where: {
				userId: userId,
				game: { status : "ENDED" },
			}
		});
	}

	async getWonGamesByUserId(userId: number): Promise<number> {
		return this.prismaService.userGame.count({
			where: {
				userId: userId,
				game: { status : "ENDED" },
				win: 1,
			}
		});
	}

	async getWinRateByUserId(userId: number): Promise<number> {
		const playedGames = await this.getPlayedGamesByUserId(userId);
		const winGames = await this.getWonGamesByUserId(userId);
		if (playedGames === 0 || winGames === 0)
			return 0;
		return winGames / playedGames * 100;
	}

	async getEloByUserId(userId: number): Promise<number> {
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

	async getAverageScoreByUserId(userId: number): Promise<number> {
		const scores = await this.prismaService.userGame.findMany({
			where: {
				userId: userId,
				game: { status : "ENDED" },
			},
			select: {
				score: true
			}
		});
    if (scores.length == 0)
      return 0
		let totalScore = 0;
		for (const score of scores) {
			totalScore += score.score;
		}
		const playedGames = scores.length
		return totalScore / playedGames;
	}

	async getEloHistoryByUserId(userId: number): Promise<EloHistoryDto> {
		const games = await this.prismaService.userGame.findMany({
			where: {
				userId: userId,
				game: { status : "ENDED" },
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

	async getRankByUserId(userId: number): Promise<number> {
		const users = await this.prismaService.user.findMany({
			select: {
				id: true,
				elo: true
			}
		});
		users.sort((a, b) => b.elo - a.elo);
		for (let i = 0; i < users.length; i++) {
			if (users[i].id === userId)
				return i + 1;
		}
		return 0;
	}

	async getStatsByUserId(userId: number): Promise<PlayerStatsDto> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			},
			select: {
				username: true
			}
		});
		if (!user)
			throw new NotFoundException("User not found")
		const playedGames = await this.getPlayedGamesByUserId(userId);
		const wonGames = await this.getWonGamesByUserId(userId);
		const winRate = await this.getWinRateByUserId(userId);
		const elo = await this.getEloByUserId(userId);
		const averageScore = await this.getAverageScoreByUserId(userId);
		const rank = await this.getRankByUserId(userId);
		return {
			username: user.username,
			playedGames: playedGames,
			wonGames: wonGames,
			winRate: winRate,
			averageScore: averageScore,
			elo: elo,
			rank: rank
		}
	}

	async getLeaderboardStats(): Promise<PlayerStatsDto[]> {
		const users = await this.prismaService.user.findMany();
		const stats = [];
		for (const user of users) {
			const userStats = await this.getStatsByUserId(user.id);
			delete userStats.rank;
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

	async getMatchHistoryByUserId(userId: number): Promise<MatchHistoryDto[]> {
		const games = await this.prismaService.userGame.findMany({
			where: {
				userId: userId,
				game: { status : "ENDED" }
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
