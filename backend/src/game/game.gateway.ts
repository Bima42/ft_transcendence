import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

@WebSocketGateway({
    cors: true,
    namespace: "game"
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server

    constructor() { }

    @SubscribeMessage('move')
    handleEvent(@MessageBody() data: string,
        @ConnectedSocket() socket: Socket): string {

        const msg = JSON.parse(data);

        const broadcastMsg = {
            paddle1: msg.y,
            paddle2: msg.y,
            ball: {
                x: 350,
                y: 300,
                vx: 20,
                vy: 20,
            }
        };
        this.server.emit("state", JSON.stringify(broadcastMsg));
        return data; // TODO: Remove ?
    }

    handleConnection(client: any, ...args: any[]): any {
        Logger.log(`Game: connected... id: ${client.id}`);
    }

    handleDisconnect(client: any): any {
        Logger.log(`Game: disconnect... id: ${client.id}`);
    }

};
