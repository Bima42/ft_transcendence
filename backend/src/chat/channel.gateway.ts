import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { ChatMessage } from '@prisma/client';
import { Socket, Server } from 'socket.io'
import { ChannelService } from './channel.service'
import { NewMessageDto } from './dto/message.dto';

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
      private readonly channelService : ChannelService
    ) { }

    @SubscribeMessage('msg')
    async handleEvent(@MessageBody() data: NewMessageDto,
        @ConnectedSocket() socket: Socket) {

        const msg = await this.channelService.postMessage(data.chatId, data);

        // The server also send back to the sender, as acknowledgement and validation
        // TODO: only send to the correct room
        this.server.emit("msg", msg);
    }

    handleConnection(client: any, ...args: any[]): any {
        Logger.log(`Chat: connected... id: ${client.id}`);
        // TODO: authentification with auth token
        //Logger.log("Chat: auth token = " + client.handshake.auth.token);
        //
        //TODO: add socket to all rooms (= channels) that the user is in
    }

    handleDisconnect(client: any): any {
        Logger.log(`Chat: disconnect... id: ${client.id}`);

        //TODO: send notifications to all users to change his status to offline
    }

};
