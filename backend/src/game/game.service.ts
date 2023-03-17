import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets'
import { JoinQueueData } from './dto/joinQueueData.dto';
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

  joinClassicModeQueue(client: Socket, payload: JoinQueueData): string {
    // Emit an event to the connected clients to join the classic mode queue
    // and add the client's socket to the queue
    Logger.log("Joined classic")
    this.classicQueue.push(client);
    const ret = this.findOrCreateMatch()
    .then(match => this.CreateUserGame(match))
    .catch(err => { console.log(err)});
    return ret ? "Joined OK" : "Not joined";
  }

  joinCustomModeQueue(client: Socket, payload: JoinQueueData): string {
    // Emit an event to the connected clients to join the custom mode queue
    // and add the client's socket to the queue
    //this.server.emit('customModeQueue');
    Logger.log("Joined custom")
    this.customQueue.push(client);
    const match = this.findOrCreateMatch();
    this.CreateUserGame(match);

    return 'Joined custom mode queue';
  }

  async getGameDetails(gameId: number): Promise<Game> {
    return await this.prismaService.game.findUnique({
        where: { id: +gameId },
    });
  }


  async findOrCreateMatch(): Promise<Game> {
    // Check if there is an available game
    Logger.log("find or csreate");
    const availableGame = await this.prismaService.game.findFirst({
      where: { status: 'SEARCHING' },
    });

    // If there is an available game, create a match and return game details
    if (availableGame) {
        return availableGame;
    }

    return await this.prismaService.game.create({
      data: {
        status: 'SEARCHING'
      }
    });
  }

    async CreateUserGame(match): Promise<UserGame> {
      Logger.log("fcreate user");
      Logger.log(match);
      const userGame = await this.prismaService.userGame.create({
          data: {
              gameId: match.id,
              userId: 1
          }
      });
      return userGame;
    }
}
