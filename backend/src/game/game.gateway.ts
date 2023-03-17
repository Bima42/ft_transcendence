import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { GameService } from './game.service';
import { JoinQueueData } from './dto/joinQueueData.dto';


@WebSocketGateway({
    cors: true,
    namespace: "game"
})
export class GameGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server

    constructor(private readonly gameService: GameService) { }

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

  afterInit(server: Server) {
    Logger.log('WebSocket server initialized');
  }

  @SubscribeMessage('newJoinQueue')
  handleJoinQueue(@MessageBody() joinQueueData: JoinQueueData,
  @ConnectedSocket() client: Socket) {
    // handle the classicModeQueue event emitted from the client
    Logger.log(`Client ${client.id} joined queue`);
    if (joinQueueData.classic)
        this.gameService.joinClassicModeQueue(client, joinQueueData);
    else
        this.gameService.joinCustomModeQueue(client, joinQueueData);
  }

  @SubscribeMessage('abortJoinQueue')
  handleAbortQueue(@MessageBody() payload: JoinQueueData,
  @ConnectedSocket() client: Socket) {
    // handle the classicModeQueue event emitted from the client
    Logger.log(`Client ${client.id} quit the queue`);
  }
// }

};
