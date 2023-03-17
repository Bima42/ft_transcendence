import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets'
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { Game } from '@prisma/client';
import { UserGame } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class GameService {
  private readonly classicQueue: Socket[] = [];
  private readonly customQueue: Socket[] = [];

  @WebSocketServer()
  server: Server

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  joinQueue(client: Socket, gameSettings: GameSettingsDto): string {
    // Emit an event to the connected clients to join the classic mode queue
    // and add the client's socket to the queue
    Logger.log("Joined classic")
    this.classicQueue.push(client);
    const ret = this.findOrCreateMatch(gameSettings)
    .then(match => this.CreateUserGame(match))
    .catch(err => { console.log(err)});
    var msg =  ret ? "Joined OK" : "Not joined";
    if(gameSettings.classic) {
      msg += " classic";
    } else {
      msg += " custom";
    }
    return msg;
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
  Logger.log(match);

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

}
