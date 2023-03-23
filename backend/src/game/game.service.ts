import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets'
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { Game } from '@prisma/client';
import { UserGame } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class GameService {
  private classicQueue: Socket[] = [];
  private customQueue: Socket[] = [];

  @WebSocketServer()
  server: Server

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  // joinQueue(client: Socket, gameSettings: GameSettingsDto): string {
  //   // Emit an event to the connected clients to join the classic mode queue
  //   // and add the client's socket to the queue
  //   Logger.log("Joined classic")
  //   this.classicQueue.push(client);
  //   const ret = this.findOrCreateMatch(gameSettings)
  //   .then(match => this.CreateUserGame(match))
  //   .catch(err => { console.log(err)});
  //   var msg =  ret ? "Joined OK" : "Not joined";
  //   if(gameSettings.classic) {
  //     msg += " classic";
  //   } else {
  //     msg += " custom";
  //   }
  //   return msg;
  // }

  // joinQueue(client: Socket, gameSettings: GameSettingsDto): string {
  //   // Emit an event to the connected clients to join the classic mode queue
  //   // and add the client's socket to the queue
  //   Logger.log("Joined classic")
  //   this.classicQueue.push(client);
  
  //   // Find or create a match and create a UserGame
  //   this.findOrCreateMatch(gameSettings)
  //   .then(async match => {
  //     await this.CreateUserGame(match);
  
  //     // Check if there are enough players to start the game
  //     const clients = this.classicQueue.splice(0, 2);
  //     if (clients.length === 2) {
  //       // Start the game
  //       await this.startGame(match, clients);
  //     }
  //   })
  //   .catch(err => { console.log(err)});
  
  //   // Return a message indicating whether the user joined the classic or custom queue
  //   let msg = gameSettings.classic ? "Joined classic" : "Joined custom";
  //   return `${msg} queue`;
  // }
  
  // joinQueue(client: Socket, gameSettings: GameSettingsDto): string {
  //   // Add the client's socket to the appropriate queue based on the game settings
  //   if (gameSettings.classic) {
  //     this.classicQueue.push(client);
  //   } else {
  //     this.customQueue.push(client);
  //   }
  
  //   // Find or create a match and create a UserGame
  //   this.findOrCreateMatch(gameSettings)
  //   .then(async match => {
  //     await this.CreateUserGame(match);
  
  //     // Check if there are enough players to start the game
  //     let clients: Socket[] = [];
  //     if (gameSettings.classic) {
  //       clients = this.classicQueue.splice(0, 2);
  //     } else {
  //       clients = this.customQueue.splice(0, 2);
  //     }
  
  //     if (clients.length === 2) {
  //       // Start the game
  //       await this.startGame(match, clients);
  //     }
  //   })
  //   .catch(err => { console.log(err)});
  
  //   // Return a message indicating whether the user joined the classic or custom queue
  //   let msg = gameSettings.classic ? "Joined classic" : "Joined custom";
  //   return `${msg} queue`;
  // }
  
  joinQueue(client: Socket, gameSettings: GameSettingsDto): string {
    // Add the client's socket to the appropriate queue based on the game settings
    if (gameSettings.classic) {
      this.classicQueue.push(client);
    } else {
      this.customQueue.push(client);
    }
  
    // Find or create a match and create a UserGame
    this.findOrCreateMatch(gameSettings)
    .then(async match => {
      await this.CreateUserGame(match);
  
      // Check if there are enough players to start the game
      let clients: Socket[] = [];
      if (gameSettings.classic) {
        clients = this.classicQueue.splice(0, 2);
      } else {
        clients = this.customQueue.splice(0, 2);
      }
  
      if (clients.length === 2) {
        // Emit an event to the clients to indicate that a match has been found
        clients.forEach(c => {
          c.emit('match-found', match.id);
        });
  
        // Wait for the clients to emit a 'validate' event before starting the game
        const validatedPromises = clients.map(c => {
          return new Promise(resolve => {
            c.once('validate', () => {
              resolve();
            });
          });
        });
        await Promise.all(validatedPromises);
  
        // Start the game
        await this.startGame(match, clients);
      }
    })
    .catch(err => { console.log(err)});
  
    // Return a message indicating whether the user joined the classic or custom queue
    let msg = gameSettings.classic ? "Joined classic" : "Joined custom";
    return `${msg} queue`;
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




private async startGame(game: Game, clients: Socket[]): Promise<void> {
  Logger.log("Starting game");

  // Update the game status to 'STARTED'
  await this.prismaService.game.update({
      where: { id: game.id },
      data: { status: 'STARTED' }
  });

  // Emit an event to the connected clients to start the game
  this.server.to(clients.map(client => client.id)).emit('start_game', { gameId: game.id });
}


}
