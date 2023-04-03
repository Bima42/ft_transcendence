import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { User, ChatMessage } from '@prisma/client';
import { Socket, Server } from 'socket.io'
import { ChannelService } from './channel.service'
import { NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MessageService } from './messages.service';
import { NewChannelDto } from './dto/channel.dto';

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

    @WebSocketServer()
    server: Server

    constructor(
      private readonly messageService : MessageService,
      private readonly channelService : ChannelService,
      private readonly authService : AuthService,
      private readonly usersService: UsersService,
    ) { }

    @SubscribeMessage('whisper')
    async handleWhisperMessage(@MessageBody() data: NewWhisperMessageDto,
                               @ConnectedSocket() socket: Socket) {
        const user : User = socket.data.user;
        const msg = await this.messageService.postMessageInWhisperChat(user, data)
        .then(msg => {
          // TODO: only send to the correct room
          // The server also send back to the sender, as acknowledgement and validation
          this.server.emit("msg", msg);
          return msg
        })
        .catch(err => {
          Logger.log(err);
          return err;
        });
        // send error back to the client
        if (typeof msg === "string")
          return msg;

        Logger.log(`New message from ${user.username}#${user.id} to ${data.receiverId}`);

    }

    @SubscribeMessage('msg')
    async handleGroupMessage(@MessageBody() data: NewChatMessageDto,
        @ConnectedSocket() socket: Socket) {
        const user : User = socket.data.user;
        const msg = await this.messageService.postMessageInGroupChat(user, data)
        .then(msg => {
          // TODO: only send to the correct room
          // The server also send back to the sender, as acknowledgement and validation
          this.server.emit("msg", msg);
          return msg
        })
        .catch(err => {
          Logger.log(err);
          return err;
        });
        // send error back to the client
        if (typeof msg === "string")
          return msg;

        Logger.log(`New message from ${user.username}#${user.id} on chat ${data.chatId}`);
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
          Logger.log("WS: client is not identified. dropped.");
          return ;
        }
        client.data.user = user;

        Logger.log(`Chat: ${user.username}#${user.id} connected`);

        //TODO: set user status online
        this.addSocketToAllRooms(client);
    }

    handleDisconnect(client: any): any {

        const user : User = client.data.user;
        Logger.log(`Chat: ${user.username}#${user.id} disconnected`);

        //TODO: set user status offline
        //TODO: send notifications to all users to change his status to offline
    }


    private async addSocketToAllRooms(client: Socket) {
      const publicChannels : NewChannelDto[] = await this.channelService.getGroupChatsForUser(client.data.user)
      publicChannels.forEach((c) => client.join(c.name));
      const privateChannels : NewChannelDto[] = await this.channelService.getWhisperChatsForUser(client.data.user)
      privateChannels.forEach((c) => client.join(c.name));
    }

};
