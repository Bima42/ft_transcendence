import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

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

    constructor() { }

    @SubscribeMessage('m')
    handleEvent(@MessageBody() data: string,
        @ConnectedSocket() socket: Socket): string {
        Logger.log("Chat: new msg");

        return data; // TODO: Remove ?
    }

    handleConnection(client: any, ...args: any[]): any {
        Logger.log(`Chat: connected... id: ${client.id}`);
    }

    handleDisconnect(client: any): any {
        Logger.log(`Chat: disconnect... id: ${client.id}`);
    }

};
