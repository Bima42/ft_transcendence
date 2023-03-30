import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameSettingsDto, JoinQueueDto } from './dto/joinQueueData.dto';
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

  server: Server

  constructor(
    private readonly prismaService: PrismaService
  ) {

  }

  async init(server: Server) {
    this.server = server;

    // Abort ongoing games:
    const currentGames = await this.prismaService.game.updateMany({
      where: {
        status: "STARTED"
      },
      data: {
        status: "ABORTED"
      }
    })

    // Verify if games are finished every now and then
    setInterval(async () => { this.checkCurrentGames() }, 2000)
  }

  async checkCurrentGames() {
    this.gameServers.forEach(async (serv) => {
      Logger.log(`Checking game ${serv.getStatus()}`);
      if (serv.getStatus() == "ABORTED") {
        Logger.log("I notice a game is aborted !");

        // TODO: Remove properly

      } else if (serv.getStatus() == "ENDED") {
        Logger.log("I notice a game is finished !");

        await this.prismaService.game.update({
          where: {
            id: serv.game.id,
          },
          data: {
            status: "ENDED"
            // TODO: Add score to DB
          }
        })

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
      Logger.log(`${user.username}#${user.id} is already in a queue !`);
      return "already in a game !";
    }

    // Add the client's socket to the appropriate queue based on the game settings
    const queue = gameSettings.type == 'CLASSIC' ? this.classicQueue : this.customQueue;
    queue.push(socket);

    Logger.log(`${user.username}#${user.id} joined the ${gameSettings.type} queue`);

    // Find or create a match and create a UserGame
    this.findOrCreateMatch(gameSettings)
    .then(async match => {
      await this.CreateUserGame(match);

      // Check if there are enough players to start the game
      if (queue.length >= 2) {
        let players = queue.splice(0, 2);


        // Start the game
        await this.startGame(match, players);
      }
    })
    .catch(err => {
      Logger.log(err)
    });

    // Return a message indicating whether the user joined the classic or custom queue
    let msg = gameSettings.type == 'CLASSIC' ? "Joined classic" : "Joined custom";
    return `OK`;
  }

  quitQueue (socket: Socket) {
    if (!socket.data.user)
      return;
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
  return await this.prismaService.game.create({
      data: {
          type: gameSettings.type,
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


private async startGame(match: Game, players: Socket[]): Promise<void> {
  Logger.log(`Game#${match.id}: match found between ${players[0].data.user.username} and ${players[1].data.user.username} !`);

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
  // Logger.log(`Socket gameserver = ${JSON.stringify(client.data.gameServer)}`);
  Logger.log(`Socket game = ${JSON.stringify(client.data.game)}`);

  if (client.data.game) {
    // Update the status in the database
    await this.prismaService.game.update({
      where: {
        id: client.data.game.id
      },
      data: {
        status: "ABORTED",
      }
    })
  }
  if (client.data.gameServer != null) {
    // Warn the gameServer
    client.data.gameServer.onPlayerDisconnect(client);

    // Destroy the gameServer (TODO: try reconnection)
    this.gameServers.splice(client.data.gameServer);
    // The socket doesn't need to be updated as it will be deleted
  }
  this.quitQueue(client);
}

playerIsReady(client: Socket) {
  if (client.data.gameServer)
    client.data.gameServer.onPlayerIsReady(client);
}


}
