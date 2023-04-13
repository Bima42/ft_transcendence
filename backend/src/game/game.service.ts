import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameSettingsDto, JoinQueueDto } from './dto/joinQueueData.dto';
import { Game } from '@prisma/client';
import { User, UserGame } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GameServer } from './gameserver';
import {EndGamePlayer} from "./dto/game.dto";


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
    this.gameServers.forEach((serv) => {
      if (serv.getStatus() == "ABORTED") {
        Logger.log(`Game #${serv.game.id} written as aborted in DB`);
        this.prismaService.game.update({
          where: {
            id: serv.game.id,
          },
          data: {
            status: "ABORTED",
          }
        })

        this.gameServers.splice(this.gameServers.indexOf(serv));

      } else if (serv.getStatus() == "ENDED") {
        Logger.log(`Game #${serv.game.id} written as ended in DB`);
        const players = serv.getPlayers()
        const scores = serv.getScore();

        // Update stats
        const player1 = {
          datas: players[0],
          score: scores[0]
        }
        const player2 = {
          datas: players[1],
          score: scores[1]
        }

        this.updateUserElo(player1, player2);

        this.prismaService.game.update({
          where: {
            id: serv.game.id,
          },
          data: {
            status: "ENDED",
            // // TODO: Add scores from the game to DB (UserGame)
            // users: {
            //   update: {
            //     where: {id: players[0].id },
            //     data: { score: scores[0] },
            //   },
            // },
          }
        })
        // TODO: Update player score in DB (total victories)
        this.gameServers.splice(this.gameServers.indexOf(serv));
      }
    })
  }

  updateUserElo(player1: EndGamePlayer, player2: EndGamePlayer) {
    const k = 32;

    const probability1 = 1 / (1 + Math.pow(10, (player2.datas.elo - player1.datas.elo) / 400));
    const probability2 = 1 / (1 + Math.pow(10, (player1.datas.elo - player2.datas.elo) / 400));

    player1.score = player1.score > player2.score ? 1 : 0;
    player2.score = player2.score > player1.score ? 1 : 0;

    const newRating1 = player1.datas.elo + k * (player1.score - probability1);
    const newRating2 = player2.datas.elo + k * (player2.score - probability2);

    this.prismaService.user.update({
      where: {
        id: player1.datas.id,
      },
      data: {
        elo: newRating1,
      }
    })

    this.prismaService.user.update({
      where: {
        id: player2.datas.id,
      },
      data: {
        elo: newRating2,
      }
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
      await this.createUserGame(match);

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

  //   This function finds an available game with status 'SEARCHING' and returns it.
  // If no game is found, it creates a new game with status 'SEARCHING' and returns it.
  async findOrCreateMatch(gameSettings: JoinQueueDto): Promise<Game> {

    // Find an available game with status 'SEARCHING'
    const availableGame = await this.prismaService.game.findFirst({
        where: {
          status: 'SEARCHING',
        },
    });

    // If an available game is found, return it
    if (availableGame) {
        return availableGame;
    }

    // If no available game is found, create a new game with status 'SEARCHING' and return it
    return this.prismaService.game.create({
        data: {
            type: gameSettings.type,
            status: 'SEARCHING'
        }
    });
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
      const players = serv.getPlayers();
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
      const players = serv.getPlayers();
      if (players.find((usr) => usr.id === user.id))
        return true;
    })
    if (!currentServer) {
      Logger.log(`No game found for ${user.username}`);
      return null;
    }
    return currentServer.toGameSettingsDto();
  }

}
