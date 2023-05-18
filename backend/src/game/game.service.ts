import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameSettingsDto, JoinQueueDto } from './dto/joinQueueData.dto';
import { Game, GameStatus, GameType } from '@prisma/client';
import { User, UserGame } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GameServer } from './gameserver';
import { UsersService } from '../users/users.service';
import { EndGamePlayer, InvitePlayer, InvitePlayer as InviteSettings } from './dto/game.dto';
import { toUserDto } from 'src/shared/mapper/user.mapper';


@Injectable()
export class GameService {

	// Array of all currently running games
	private gameServers: GameServer[] = [];

	server: Server

	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService,
	) { }

	async init(server: Server) {
		this.server = server;

		// Abort ongoing games:
		await this.prismaService.game.updateMany({
			where: {
				status: "STARTED"
			},
			data: {
				status: "ABORTED"
			}
		})

		// Verify if games are finished every now and then
		setInterval(async () => { this.checkCurrentGames() }, 10000)
	}

	async checkCurrentGames() {
		this.gameServers.forEach(async (serv) => {
			const servStatus = serv.getStatus()
			if (["INVITING", "SEARCHING", "STARTED"].includes(servStatus)) {
				console.log(`game is ${servStatus}, skipped}`)
				return;
			}
			const players = serv.getEndPlayers()

			await this.usersService.updateData(players[0].user.id, {status: "ONLINE"})
			await this.usersService.updateData(players[1].user.id, {status: "ONLINE"})

			if (servStatus == "ABORTED") {
				Logger.log(`Game #${serv.game.id} written as aborted in DB`);
				try {
					await this.prismaService.game.update({
						where: {
							id: serv.game.id,
						},
						data: {
							status: "ABORTED",
							endedAt: new Date()
						}
					})
				} catch {
					Logger.error(`Game #${serv.game.id} was already deleted`)
				}

				serv.cleanupGameDataOnSockets();
				this.gameServers.splice(this.gameServers.indexOf(serv));

			} else if (serv.getStatus() == "ENDED") {
				Logger.log(`Game #${serv.game.id} written as ended in DB`);

				// Update stats
				try {
					await this.updateUserElo(players[0], players[1]);

					await this.prismaService.game.update({
						where: { id: serv.game.id, },
						data: {
							status: "ENDED",
							endedAt: new Date(),
						}
					})
				} catch {
					Logger.error(`Game #${serv.game.id} was already deleted`)
				}

				serv.cleanupGameDataOnSockets();
				this.gameServers.splice(this.gameServers.indexOf(serv));
			}
		})
	}

	/**
	 * @brief Update the elo of the players
	 *
	 * This function could be updated later to be more generic
	 *   - K-factor : 32 by default, could be changed depending on the user's elo
	 *   - Scale Factor : 400 by default, based on satisfying human perception of ratings
	 */
	async updateUserElo(player1: EndGamePlayer, player2: EndGamePlayer) {

		// Usergame
		await this.prismaService.userGame.update({
			where: { id: player1.userGame.id },
			data: {
				score: player1.userGame.score,
				win: player1.userGame.win,
				elo: player1.user.elo,
			},
		})
		await this.prismaService.userGame.update({
			where: { id: player2.userGame.id },
			data: {
				score: player2.userGame.score,
				win: player2.userGame.win,
				elo: player2.user.elo,
			},
		})

		const k = 32;
		const scaleFactor = 400;

		const probability1 = 1 / (1 + Math.pow(10, (player2.user.elo - player1.user.elo) / scaleFactor));
		const probability2 = 1 / (1 + Math.pow(10, (player1.user.elo - player2.user.elo) / scaleFactor));

		player1.user.elo = Math.round(player1.user.elo + k * (player1.userGame.win - probability1));
		player2.user.elo = Math.round(player2.user.elo + k * (player2.userGame.win - probability2));

		// Users
		await this.prismaService.user.update({
			where: { id: player1.user.id, },
			data: { elo: player1.user.elo, }
		})
		await this.prismaService.user.update({
			where: { id: player2.user.id, },
			data: { elo: player2.user.elo, }
		})

	}

	private async isInQueue(user: User): Promise<boolean> {
		const existingUserGame = await this.prismaService.userGame.findFirst({
			where: {
				game: { status: { in: ["SEARCHING", "INVITING"] } },
				userId: user.id,
			}
		})
		return !!existingUserGame
	}

	private async isInGame(user: User): Promise<boolean> {
		const existingUserGame = await this.prismaService.userGame.findFirst({
			where: {
				game: { status: "STARTED" },
				userId: user.id,
			}
		})
		return !!existingUserGame
	}

	async joinQueue(socket: Socket, gameSettings: JoinQueueDto): Promise<string> {

		const user: User = socket.data.user;
		if (!user)
			return;

		// Verify if the user already in queue:
		if (await this.isInQueue(user)) {
			Logger.log(`Game: ${user.username}#${user.id} is already in a queue !`);
			return "already in queue !";
		}

		Logger.log(`Game: ${user.username}#${user.id} joined the ${gameSettings.type} queue`);

		// Find or create a match and create a UserGame
		const match = await this.findOrCreateMatch(gameSettings)
		await socket.join("game" + match.id.toString())
		socket.data.userGame = await this.createUserGame(match, user);

		// Check if there are enough players to start the game
		const playersUserGames: UserGame[] = await this.prismaService.userGame.findMany({
			where: {
				game: { id: match.id }
			}
		})
		if (playersUserGames.length >= 2) {
			const players = await this.server.in("game" + match.id.toString()).fetchSockets()
			Logger.log(`n sockets = ${players.length}`)

			await this.startGame(match, players as unknown as Socket[]);
		}

		return `OK`;
	}

	async quitQueue(socket: Socket) {
		const user: User = socket.data.user;
		if (!user)
			return;
		try {
			const matches = await this.prismaService.game.findMany({
				where: {
					status: { in: ["SEARCHING", "INVITING"] },
					users: { some: { userId: user.id } }
				}
			})
			for (const match of matches) {
				socket.leave("game" + match.id.toString())
				await this.prismaService.userGame.deleteMany({
					where: {
						game: { status: "SEARCHING" },
						userId: user.id,
					}
				})
				await this.prismaService.game.delete({
					where: { id: match.id }
				})
			}
		} catch (e) {
			// Logger.error(e)
		}
		Logger.log(`Game: ${user.username}#${user.id} quit the classic queue`);
	}

	async getGameDetails(gameId: number): Promise<Game> {
		return this.prismaService.game.findUnique({
			where: { id: +gameId },
		});
	}

	async createMatch(type: GameType, status: GameStatus): Promise<Game> {
		return await this.prismaService.game.create({
			data: {
				type: type,
				status: status
			}
		});
	}

	async findOrCreateMatch(gameSettings: JoinQueueDto): Promise<Game> {

		// Find an available game with status 'SEARCHING'
		const availableGame = await this.prismaService.game.findFirst({
			where: {
				status: 'SEARCHING',
				type: gameSettings.type,
			},
			include: {
				users: true
			}
		});

		if (availableGame) {
			return availableGame;
		} else {
			return await this.createMatch(gameSettings.type, 'SEARCHING')
		}
	}

	// This function creates a new UserGame associated with the provided match object and returns it.
	async createUserGame(match: Game, user: User): Promise<UserGame> {

		// Create a new UserGame associated with the provided match object and user ID 1
		return this.prismaService.userGame.create({
			data: {
				gameId: match.id,
				userId: user.id
			}
		});
	}

	private async startGame(match: Game, players: Socket[]): Promise<void> {
		Logger.log(`Game#${match.id}: ${match.type} match found between ${players[0].data.user.username} and ${players[1].data.user.username} !`);

		// Update user informations
		players[0].data.user = await this.usersService.updateData(players[0].data.user.id, { status: "BUSY"})
		players[1].data.user = await this.usersService.updateData(players[1].data.user.id, {status: "BUSY"})


		// Update the game status to 'STARTED'
		await this.prismaService.game.update({
			where: { id: match.id },
			data: { status: 'STARTED' }
		});

		// Create the game server
		const gameServer = new GameServer(this.server, match, players);
		this.gameServers.push(gameServer);

		// Link all infos to socket
		players.forEach((player) => {
			player.data.gameServer = gameServer;
			player.data.game = match;
			player.data.isReady = false;
			player.join("game" + String(match.id))
		})

		// Emit an event to the clients to indicate that a match has been found
		const gameSettings: GameSettingsDto = {
			game: match,
			player1: players[0].data.user,
			player2: players[1].data.user,
		}
		this.server.to(players[0].data.user.username)
			.to("game" + match.id.toString())
			.emit("matchFound", gameSettings);
	}

	async onPlayerDisconnect(client: Socket) {
		if (client.data.gameServer != null) {
			// Warn the gameServer
			client.data.gameServer.onPlayerDisconnect(client);
		}
		this.quitQueue(client);
	}

	playerIsReady(client: Socket) {
		if (client.data.gameServer)
			client.data.gameServer.onPlayerIsReady(client);
	}

	tryToReconnect(client: Socket) {
		const currentServer = this.gameServers.find((serv) => {
			const players = serv.getUsers();
			if (players.find((usr) => usr.id == client.data.user.id))
				return true;
		})
		if (!currentServer)
			return;
		currentServer.onPlayerReconnect(client);
	}

	getCurrentGame(user: User): GameSettingsDto | null {
		if (!user)
			return null;
		const currentServer = this.gameServers.find((serv) => {
			const players = serv.getUsers();
			if (players.find((usr) => usr.id === user.id))
				return true;
		})
		if (!currentServer) {
			return null;
		}
		return currentServer.toGameSettingsDto();
	}

	async inviteSomebodyToPlay(client: Socket, inviteSettings: InviteSettings) {
		Logger.log(`Invited to play: ${JSON.stringify(inviteSettings)}`)

		const user: User = client.data.user;
		if (!user)
			return;

		// cannot invite if already in a game
		if (await this.isInGame(user))
			return "You are already in a game !";

		// Retrieving other player
		const otherUser = await this.prismaService.user.findUnique({
			where: { id: inviteSettings.userId }
		})
		if (!otherUser) {
			Logger.log(`Invite: cannot find other user`)
			return "Cannot find other user";
		}
		if (otherUser.status === "OFFLINE") {
			return `${otherUser.username} is currently offline`
		} else if (otherUser.status === "BUSY") {
			return `${otherUser.username} is currently playing`
		}

		if (this.isInQueue(user))
			this.quitQueue(client)

		const match = await this.createMatch(inviteSettings.gameType, 'INVITING')
		client.data.userGame = await this.createUserGame(match, client.data.user);

		const settings: GameSettingsDto = {
			player1: client.data.user,
			player2: otherUser,
			game: match,
		}
		this.server.to("user" + otherUser.id.toString()).emit("gameInvitation", settings)
		await client.join("game" + match.id.toString())

		Logger.log(`${user.username}#${user.id} invited ${otherUser.username}#${otherUser.id} to play a ${match.type} game`)

		return "OK"
	}

	async cancelInvitation(client: Socket, settings: GameSettingsDto) {
		const user: User = client.data.user;
		if (!user)
			return;
		Logger.log(`${user.username} cancelled the invitation to ${settings.player2.username}`)
		try {
			await this.prismaService.userGame.deleteMany({
				where: {
					gameId: settings.game.id
				}
			})
			await this.prismaService.game.delete({
				where: {
					id: settings.game.id
				}
			})
		} catch (error) {
		}
		// TODO: send a message to target user (unless we still use alert in frontend)
	}

	async acceptInvitation(client: Socket, settings: GameSettingsDto) {
		const user: User = client.data.user;
		if (!user)
			return;
		Logger.log(`${user.username} accepted the invitation of ${settings.player1.username}`)


		// Get the updated game in the DB (if invitation is not cancelled)
		const match = await this.prismaService.game.findFirst({
			where: {
				id: settings.game.id
			}
		})
		// Sometimes the game is already cancelled or started
		if (!match || match.status != "INVITING") {
			Logger.error(`game #${match.id}: match not found`)
			return "Match not found"
		}
		client.data.userGame = await this.createUserGame(match, user);
		await client.join("game" + match.id.toString())

		// Get all sockets in game room:
		const players = await this.server.in("game" + match.id.toString()).fetchSockets()

		await this.startGame(match, players as unknown as Socket[])
	}

	async declineInvitation(client: Socket, settings: GameSettingsDto) {
		const user: User = client.data.user;
		if (!user)
			return;
		Logger.log(`${user.username} declined the invitation of ${settings.player1.username}`)

		client.to("game" + settings.game.id.toString()).emit("invitationDeclined", settings)
		try {
			await this.prismaService.userGame.deleteMany({
				where: {
					gameId: settings.game.id
				}
			})
			await this.prismaService.game.delete({
				where: {
					id: settings.game.id
				}
			})
			}
		catch {}
	}
}
