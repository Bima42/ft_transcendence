import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameSettingsDto, JoinQueueDto } from './dto/joinQueueData.dto';
import { Game, GameStatus, GameType } from '@prisma/client';
import { User, UserGame } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GameServer } from './gameserver';
import { EndGamePlayer, InvitePlayer as InviteSettings } from './dto/game.dto';


@Injectable()
export class GameService {
  private classicQueue: Socket[] = [];
  private customQueue: Socket[] = [];

  // Array of all currently running games
  private gameServers: GameServer[] = [];

  server: Server

  constructor(
    private readonly prismaService: PrismaService
  ) {}

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
      if (serv.getStatus() == "ABORTED") {
        Logger.log(`Game #${serv.game.id} written as aborted in DB`);
        await this.prismaService.game.update({
          where: {
            id: serv.game.id,
          },
          data: {
            status: "ABORTED",
          }
        })

        serv.cleanupGameDataOnSockets();
        this.gameServers.splice(this.gameServers.indexOf(serv));

      } else if (serv.getStatus() == "ENDED") {
        Logger.log(`Game #${serv.game.id} written as ended in DB`);
        const players = serv.getEndPlayers()

        // Update stats
        this.updateUserElo(players[0], players[1]);

        this.prismaService.game.update({
          where: { id: serv.game.id, },
          data: { status: "ENDED", }
        })
        // TODO: Update player score in DB (total victories)
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
    const k = 32;
    const scaleFactor = 400;

    const probability1 = 1 / (1 + Math.pow(10, (player2.user.elo - player1.user.elo) / scaleFactor));
    const probability2 = 1 / (1 + Math.pow(10, (player1.user.elo - player2.user.elo) / scaleFactor));

    player1.user.elo = player1.user.elo + k * (player1.userGame.win - probability1);
    player2.user.elo = player2.user.elo + k * (player2.userGame.win - probability2);

    // Users
    this.prismaService.user.update({
      where: { id: player1.user.id, },
      data: { elo: player1.user.elo, }
    })
    this.prismaService.user.update({
      where: { id: player2.user.id, },
      data: { elo: player2.user.elo, }
    })

    // Usergame
    this.prismaService.userGame.update({
      where: { id: player1.userGame.id },
      data: {
        score: player1.userGame.score,
        win: player1.userGame.win,
      },
    })
    this.prismaService.userGame.update({
      where: { id: player2.userGame.id },
      data: {
        score: player2.userGame.score,
        win: player2.userGame.win,
      },
    })
  }

  joinQueue(socket: Socket, gameSettings: JoinQueueDto): string {

    const user: User = socket.data.user;
    if (!user)
      return;

    // Verify if the user already in queue:
    if (this.classicQueue.find((el) => el.data.user.id === user.id) ||
        this.customQueue.find((el) => el.data.user.id === user.id)) {
      Logger.log(`Game: ${user.username}#${user.id} is already in a queue !`);
      return "already in a game !";
    }

    // Add the client's socket to the appropriate queue based on the game settings
    const queue = gameSettings.type == 'CLASSIC' ? this.classicQueue : this.customQueue;
    queue.push(socket);

    Logger.log(`Game: ${user.username}#${user.id} joined the ${gameSettings.type} queue`);

    // Find or create a match and create a UserGame
    this.findOrCreateMatch(gameSettings)
    .then(async match => {
      socket.data.userGame = await this.createUserGame(match);

      // Check if there are enough players to start the game
      if (queue.length >= 2) {
        const players = queue.splice(0, 2);


        // Start the game
        await this.startGame(match, players);
      }
    })
    .catch(err => {
      Logger.log(err)
    });

    return `OK`;
  }

  quitQueue (socket: Socket) {
    if (!socket.data.user)
      return;
    const idx_classic = this.classicQueue.indexOf(socket);
    if (idx_classic >= 0) {
      Logger.log(`Game: ${socket.data.user.username}#${socket.data.user.id} quit the classic queue`);
      this.classicQueue.splice(idx_classic, 1);
    }
    const idx_custom = this.customQueue.indexOf(socket);
    if (idx_custom >= 0) {
      Logger.log(`Game: ${socket.data.user.username}#${socket.data.user.id} quit the custom queue`);
      this.customQueue.splice(idx_custom, 1);
    }
  }

  async getGameDetails(gameId: number): Promise<Game> {
    return this.prismaService.game.findUnique({
        where: { id: +gameId },
    });
  }

  async createMatch(type: GameType , status: GameStatus): Promise<Game> {
    return await this.prismaService.game.create({
        data: {
            type: type,
            status: status
        }
    });
  }

  //   This function finds an available game with status 'SEARCHING' and returns it.
  // If no game is found, it creates a new game with status 'SEARCHING' and returns it.
  async findOrCreateMatch(gameSettings: JoinQueueDto): Promise<Game> {

    // Find an available game with status 'SEARCHING'
    const availableGame = await this.prismaService.game.findFirst({
        where: {
          status: 'SEARCHING',
        },
    });

    if (availableGame) {
      return availableGame;
    } else {
      return await this.createMatch(gameSettings.type, 'SEARCHING')
    }
  }

  // This function creates a new UserGame associated with the provided match object and returns it.
  async createUserGame(match: Game): Promise<UserGame> {

    // Create a new UserGame associated with the provided match object and user ID 1
    return this.prismaService.userGame.create({
        data: {
            gameId: match.id,
            userId: 1
        }
    });
  }

  private async startGame(match: Game, players: Socket[]): Promise<void> {
    Logger.log(`Game#${match.id}: ${match.type} match found between ${players[0].data.user.username} and ${players[1].data.user.username} !`);

    // Emit an event to the clients to indicate that a match has been found
    const gameSettings : GameSettingsDto = {
      game: match,
      player1: players[0].data.user,
      player2: players[1].data.user,
    }
    this.server.to(players[0].data.user.username)
               .to(players[1].data.user.username)
               .emit("matchFound", gameSettings);

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
        player.join(String(match.id))
    })
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
      return ;
    currentServer.onPlayerReconnect(client);
  }

  getCurrentGame(user: User) : GameSettingsDto | null {
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
    // cannot invite if already in a game
    if (this.getCurrentGame(client.data.user))
      return ;

    const game = await this.prismaService.game.findFirst({
      where: {
        users: { some: { userId: client.data.user.id }},
        status: { in: ['SEARCHING', 'INVITING', 'STARTED']}
      }
    })
    if (game) {
      Logger.log(`Invite: already in a game`)
      return ;
    }

    const otherUser = await this.prismaService.user.findUnique({
      where: { id: inviteSettings.userId }
    })
    if (!otherUser) {
      Logger.log(`Invite: cannot find other user`)
      return ;
    }

    const newGame = await this.createMatch(inviteSettings.gameType, 'INVITING')
    const settings: GameSettingsDto = {
      player1: client.data.user,
      player2: otherUser,
      game: newGame,
    }
    this.server.to(otherUser.username).emit("gameInvitation", settings)
  }

}
