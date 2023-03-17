import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets'
import { JoinQueueData } from './dto/joinQueueData.dto';

@Injectable()
export class GameService {
  private readonly classicQueue: Socket[] = [];
  private readonly customQueue: Socket[] = [];

  @WebSocketServer()
  server: Server

  constructor() {}

  joinClassicModeQueue(client: Socket, payload: JoinQueueData): string {
    // Emit an event to the connected clients to join the classic mode queue
    // and add the client's socket to the queue
    Logger.log("Joined classic")
    this.classicQueue.push(client);
    return 'Joined classic mode queue';
  }

  joinCustomModeQueue(client: Socket, payload: JoinQueueData): string {
    // Emit an event to the connected clients to join the custom mode queue
    // and add the client's socket to the queue
    //this.server.emit('customModeQueue');
    Logger.log("Joined custom")
    this.customQueue.push(client);
    return 'Joined custom mode queue';
  }
}
