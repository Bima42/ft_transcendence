import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { User, ChatMessage } from '@prisma/client';
import { Socket, Server } from 'socket.io'
import { ChannelService } from './channel.service'
import { NewMessageDto } from './dto/message.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
    path: "/api/socket.io",
    namespace: "chat",
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, Cookie',
      methods: ["GET", "POST"],
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private userSockets: { [key: string]: User } = {};

    @WebSocketServer()
    server: Server

    constructor(
      private readonly channelService : ChannelService,
      private readonly authService : AuthService,
      private readonly usersService: UsersService,
    ) { }

    @SubscribeMessage('msg')
    async handleEvent(@MessageBody() data: NewMessageDto,
        @ConnectedSocket() socket: Socket) {

        const user : User = this.userSockets[socket.id];
        const msg = await this.channelService.postMessage(user, data.chatId, data)
        .then(msg => {
          this.server.emit("msg", msg);
          return msg
        })
        .catch(err => {
          Logger.log(err);
          return err;
        });
        if (typeof msg === "string")
          return msg;

        // The server also send back to the sender, as acknowledgement and validation
        // TODO: only send to the correct room
    }

    async handleConnection(client: any, ...args: any[]) {

        // Extract user id from token
        const userId = this.authService.verifyToken(client.handshake.auth.token);
        if (!userId) {
          client.disconnect();
          Logger.log("WS: client has no token. dropped.");
          return ;
        }

        const user = await this.usersService.findById(userId.sub);
        if (!user) {
          client.disconnect();
          Logger.log("WS: client cannot be identified: dropped.");
          return;
        }
        this.userSockets[client.id] = user;

        Logger.log(`Chat: user connected: ${user.username}`);

        //TODO: set user status online
        //TODO: add socket to all rooms (= channels) that the user is in
    }

    handleDisconnect(client: any): any {

        const user : User = this.userSockets[client.id];
        Logger.log(`Chat: user disconnected: ${user.username}`);
        delete this.userSockets[client.id];

        //TODO: set user status offline
        //TODO: send notifications to all users to change his status to offline
    }

};
