import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { User, UserChat, ChatMessage } from '@prisma/client';
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
        Logger.log(`New message from ${user.username}#${user.id} on chat ${data.chatId}`);
        const msg = await this.channelService.postMessage(user, data.chatId, data)
        .then(msg => {
          // DONE: only send to the correct room
          // The server also send back to the sender, as acknowledgement and validation
          this.server.to(JSON.stringify(data.chatId)).emit("msg", msg);
          return msg
        })
        .catch(err => {
          Logger.log(err);
          return err;
        });
        // send error back to the client
        if (typeof msg === "string")
          return msg;
    }

    async handleConnection(client: any, ...args: any[]) {

        // Extract user id from token
        const token = client.handshake.auth.token;
        if (!token) {
          client.disconnect();
          Logger.log("WS: client has no token. dropped.");
          return ;
        }
        const userId = this.authService.verifyToken(token);

        const user = await this.usersService.findById(userId.sub);
        if (!user) {
          client.disconnect();
          Logger.log("WS: client cannot be identified: dropped.");
          return;
        }
        this.userSockets[client.id] = user;

        Logger.log(`Chat: ${user.username}#${user.id} connected`);

        //TODO: set user status online
        //TODO: add socket to all rooms (= channels) that the user is in
        
        const chats = await this.usersService.getAlluserchat(user.id);
        chats.forEach((userchat: UserChat) => {
            Logger.log(`chat = ${userchat.chatId}`)
            client.join(JSON.stringify(userchat.chatId))
        })
    }

    handleDisconnect(client: any): any {

        const user : User = this.userSockets[client.id];
        Logger.log(`Chat: ${user.username}#${user.id} disconnected`);
        delete this.userSockets[client.id];

        //TODO: set user status offline
        //TODO: send notifications to all users to change his status to offline

    }

};
