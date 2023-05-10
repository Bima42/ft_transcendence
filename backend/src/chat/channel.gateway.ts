import { Logger, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { ChannelService } from './channel.service'
import { NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { toUserDto } from '../shared/mapper/user.mapper';

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

    private userSockets: { [key: string]: UserDto } = {};

    @WebSocketServer()
    server: Server

    constructor(
      private readonly channelService : ChannelService,
      private readonly authService : AuthService,
      private readonly usersService: UsersService,
    ) { }

    @SubscribeMessage('msg')
    async handleEvent(@MessageBody() data: NewChatMessageDto,
        @ConnectedSocket() socket: Socket) {

        const user = this.userSockets[socket.id];
        Logger.log(`New message from ${user.username}#${user.id} on chat ${data.chatId}`);
        const msg = this.channelService.postMessage(user, data.chatId, data)
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
    }

	@SubscribeMessage('whisper')
    async handleWhisperMessage(@MessageBody() data: NewWhisperMessageDto,
                               @ConnectedSocket() socket: Socket) {
        const msg = await this.channelService.postMessageInWhisperChat(socket.data.user, data)
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

        Logger.log(`New whisper from ${socket.data.user.username}#${socket.data.user.id} to ${data.receiverId}`);

    }

    private async verifyUser(token: string) : Promise<UserDto> {
      if (!token)
        return null;

      try {
        const verifiedToken = this.authService.verifyToken(token);
        const user = await this.usersService.findById(verifiedToken.sub);
        return toUserDto(user);
      } catch (err) {
        throw new UnauthorizedException("Invalid token");
      }
    }

    async handleConnection(client: any, ...args: any[]) {

        const user = await this.verifyUser(client.handshake.auth.token);
        if (!user) {
          Logger.log("WS: client is not identified. dropped.");
          return ;
        }
        this.userSockets[client.id] = user;

        Logger.log(`Chat: ${user.username}#${user.id} connected`);

        //TODO: set user status online
        //TODO: add socket to all rooms (= channels) that the user is in
    }

    handleDisconnect(client: any): any {

        const user = this.userSockets[client.id];
        Logger.log(`Chat: ${user.username}#${user.id} disconnected`);
        delete this.userSockets[client.id];

        //TODO: set user status offline
        //TODO: send notifications to all users to change his status to offline
    }

};
