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
    async handleEvent(@MessageBody() data: any,
        @ConnectedSocket() socket: Socket) {

        const gameServer = socket.data.gameServer;
        if (!gameServer) {
          Logger.log("No game server found");
          return;
        }

        gameServer.onPlayerMove(socket, data);
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

        // attach the user to the socket
        client.data.user = user;

        // client joins its own rooms, so that we send messages to all his devices
        client.join(user.username);

        Logger.log(`Game: ${user.username}#${user.id} connected`);
    }

    handleDisconnect(client: any): any {
        Logger.log(`Game: ${client.data.user.username}#${client.data.user.id} left`);
        this.gameService.quitQueue(client);
    }

  afterInit(server: Server) {
    Logger.log('WebSocket server initialized');
    this.gameService.setServer(server);
  }

  @SubscribeMessage('newJoinQueue')
  handleJoinQueue(@MessageBody() joinQueueData: GameSettingsDto,
                  @ConnectedSocket() client: Socket): string {
    return this.gameService.joinQueue(client, joinQueueData);
  }

  @SubscribeMessage('abortJoinQueue')
  handleAbortQueue(@ConnectedSocket() client: Socket) {
    return this.gameService.quitQueue(client);
  }
// }

};
