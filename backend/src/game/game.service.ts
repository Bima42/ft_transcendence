import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets'
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { Game } from '@prisma/client';
import { User, UserGame } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GameServer } from './gameserver';


@Injectable()
export class GameService {
  private classicQueue: Socket[] = [];
  private customQueue: Socket[] = [];

  // Array of all currently running games
  private gameServers: GameServer[] = [];
  // A map socket.id => GameServer
  private gameSockets: { [key: string]: GameServer } = {};

  server: Server

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  joinQueue(socket: Socket, gameSettings: GameSettingsDto): string {

    const user: User = socket.data.user;

    // Verify if the user already in queue:
    if (this.classicQueue.find((el) => el.data.user.id === user.id) ||
        this.customQueue.find((el) => el.data.user.id === user.id)) {
      Logger.log(`${user.username}#${user.id} is already in a queue !`);
      return "already in a game !";
    }

    // Add the client's socket to the appropriate queue based on the game settings
    const queue = gameSettings.classic ? this.classicQueue : this.customQueue;
    queue.push(socket);

    Logger.log(`${user.username}#${user.id} joined the queue`);

    // Find or create a match and create a UserGame
    this.findOrCreateMatch(gameSettings)
    .then(async match => {
      await this.CreateUserGame(match);

      // Check if there are enough players to start the game
      if (queue.length >= 2) {
        let players = queue.splice(0, 2);

        // Emit an event to the clients to indicate that a match has been found
        this.server.to(players[0].data.user.username)
                   .to(players[1].data.user.username)
                   .emit("matchFound", match);

        // Start the game
        await this.startGame(match, players);
      }
    })
    .catch(err => {
      Logger.log(err)
    });

    // Return a message indicating whether the user joined the classic or custom queue
    let msg = gameSettings.classic ? "Joined classic" : "Joined custom";
    return `OK`;
  }

  quitQueue (socket: Socket) {
    this.classicQueue = this.classicQueue.filter((el) => { el.data.user.username !== socket.data.user.username});
    this.customQueue = this.customQueue.filter((el) => { el.data.user.username !== socket.data.user.username});
    Logger.log(`${socket.data.user.username}#${socket.data.user.id} quit the queue`);
  }

  async getGameDetails(gameId: number): Promise<Game> {
    return await this.prismaService.game.findUnique({
        where: { id: +gameId },
    });
  }

//   This function finds an available game with status 'SEARCHING' and returns it.
// If no game is found, it creates a new game with status 'SEARCHING' and returns it.
async findOrCreateMatch(gameSettings: GameSettingsDto): Promise<Game> {

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
  return await this.prismaService.game.create({
      data: {
          status: 'SEARCHING'
      }
  });
}

// This function creates a new UserGame associated with the provided match object and returns it.
async CreateUserGame(match: Game): Promise<UserGame> {

  // Create a new UserGame associated with the provided match object and user ID 1
  const userGame = await this.prismaService.userGame.create({
      data: {
          gameId: match.id,
          userId: 1
      }
  });

  // Return the created UserGame
  return userGame;
}


private async startGame(game: Game, players: Socket[]): Promise<void> {
  Logger.log(`starting the game between
             ${players[0].data.user.username} and ${players[1].data.user.username} !`);

  // Update the game status to 'STARTED'
  await this.prismaService.game.update({
      where: { id: game.id },
      data: { status: 'STARTED' }
  });

  // Create the game server
  const gameServer = new GameServer({server: this.server});
  this.gameServers.push(gameServer);
  players[0].data.gameServer = gameServer;
  players[1].data.gameServer = gameServer;
}

async   findGameFromUser( user: User) : Promise<GameServer>{
  return this.gameSockets[user.id];
}


}
