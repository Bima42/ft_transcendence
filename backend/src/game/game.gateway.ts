import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { User } from '@prisma/client';
import { GameService } from './game.service';
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { GameServer } from './gameserver'
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';


@WebSocketGateway({
    path: "/api/socket.io",
    namespace: "game",
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, Cookie',
      methods: ["GET", "POST"],
    }
})
export class GameGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

    private userSockets: { [key: string]: User } = {};

    @WebSocketServer()
    server: Server

    constructor(private readonly gameService: GameService,
                private readonly authService : AuthService,
                private readonly usersService: UsersService,
               ) {
    }

    @SubscribeMessage('move')
    async handleEvent(@MessageBody() data: string,
        @ConnectedSocket() socket: Socket) {

        const msg = JSON.parse(data);
        const user =  this.userSockets[socket.id];

        const game = await this.gameService.findGameFromSocket(socket.id);
        if (!game) {
          return;
        }

        game.onPlayerMove();
        // this.server.emit("state", JSON.stringify(broadcastMsg));
    }

    private async verifyUser(token: string) : Promise<User> {

        if (!token)
          return null;

        const userId = this.authService.verifyToken(token);

        return await this.usersService.findById(userId.sub);
    }

    async handleConnection(client: any, ...args: any[]) {

        const user = await this.verifyUser(client.handshake.auth.token);
        if (!user) {
          Logger.log("WS: client is not verified. dropped.");
          return ;
        }
        this.userSockets[client.id] = user;

        Logger.log(`Game: ${user.username}#${user.id} connected`);
    }

    handleDisconnect(client: any): any {
        Logger.log(`Game: disconnect... id: ${client.id}`);
    }

  afterInit(server: Server) {
    Logger.log('WebSocket server initialized');
  }

  @SubscribeMessage('newJoinQueue')
  handleJoinQueue(@MessageBody() joinQueueData: GameSettingsDto,
  @ConnectedSocket() client: Socket): string {
    // handle the classicModeQueue event emitted from the client

    const user =  this.userSockets[client.id];
    Logger.log(`Client ${user.username} joined queue`);

    return this.gameService.joinQueue(client, joinQueueData);
  }

  @SubscribeMessage('abortJoinQueue')
  handleAbortQueue(@MessageBody() payload: GameSettingsDto,
  @ConnectedSocket() client: Socket) {
    // handle the classicModeQueue event emitted from the client
    const user =  this.userSockets[client.id];
    return this.gameService.quitQueue(client);
  }
// }

};
