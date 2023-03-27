import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets'
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { Game } from '@prisma/client';
import { UserGame } from '@prisma/client';
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

  @WebSocketServer()
  server: Server

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  joinQueue(client: Socket, gameSettings: GameSettingsDto): string {
    Logger.log(`${client.id} joined the queue`);

    // Add the client's socket to the appropriate queue based on the game settings
    const queue = gameSettings.classic ? this.classicQueue : this.customQueue;
    queue.push(client);

    // Find or create a match and create a UserGame
    this.findOrCreateMatch(gameSettings)
    .then(async match => {
      await this.CreateUserGame(match);

      // Check if there are enough players to start the game
      if (queue.length >= 2) {
        let players = queue.splice(0, 2);
        // Emit an event to the clients to indicate that a match has been found
        players.forEach(p => {
          p.emit('matchFound', match);
        });

        // Wait for the clients to emit a 'validate' event before starting the game
        // const validatedPromises = clients.map(c => {
        //   return new Promise(resolve => {
        //     c.once('validate', () => {
        //       resolve("adf");
        //     });
        //   });
        // });
        // await Promise.all(validatedPromises);

        // Start the game
        Logger.log(`starting the game !`);
        await this.startGame(match, players);
      }
    })
    .catch(err => {
      Logger.log(err)
    });

    // Return a message indicating whether the user joined the classic or custom queue
    let msg = gameSettings.classic ? "Joined classic" : "Joined custom";
    return `${msg} queue`;
  }

  quitQueue (user: User) {
    const idx_classic = this.classicQueue.indexOf(client);
    if (idx_classic >= 0) {
      Logger.log(`Client ${client.id} quit the classic queue`);
      this.classicQueue.splice(idx_classic, 1);
    }
    const idx_custom = this.customQueue.indexOf(client);
    if (idx_custom >= 0) {
      Logger.log(`Client ${client.id} quit the custom queue`);
      this.customQueue.splice(idx_custom, 1);
    }
  }


  async getGameDetails(gameId: number): Promise<Game> {
    return await this.prismaService.game.findUnique({
        where: { id: +gameId },
    });
  }

//   This function finds an available game with status 'SEARCHING' and returns it.
// If no game is found, it creates a new game with status 'SEARCHING' and returns it.
async findOrCreateMatch(gameSettings: GameSettingsDto): Promise<Game> {
  Logger.log("find or create");

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
  Logger.log("create4 user");
  // Logger.log(match);

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


private async startGame(game: Game, clients: Socket[]): Promise<void> {
  Logger.log("Starting game");

  // Update the game status to 'STARTED'
  await this.prismaService.game.update({
      where: { id: game.id },
      data: { status: 'STARTED' }
  });

  // Emit an event to the connected clients to start the game
  this.server.to(clients.map(client => client.id)).emit('matchFound', game);

  // Create the game server
  this.gameServers.push(new GameServer({server: this.server}));
}

async   findGameFromSocket(socketId: string) : Promise<GameServer>{
  return this.gameSockets[socketId];
}


}
