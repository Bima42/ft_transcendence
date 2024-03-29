import { Logger, UseFilters } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, WsException, BaseWsExceptionFilter } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { GameService } from './game.service';
import { GameSettingsDto, JoinQueueDto } from './dto/joinQueueData.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { toUserDto } from '../shared/mapper/user.mapper';
import { InvitePlayer } from './dto/game.dto';


@UseFilters(new BaseWsExceptionFilter())
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

	@WebSocketServer()
	server: Server

	constructor(private readonly gameService: GameService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {
	}

	@SubscribeMessage('move')
	async handleEvent(@MessageBody() data: any,
		@ConnectedSocket() socket: Socket) {

		const gameServer = socket.data.gameServer;
		if (!gameServer) {
			return;
		}

		gameServer.onPlayerMove(socket, data);
	}

	@SubscribeMessage('playerDisconnect')
	async handlePlayerDisconnect(@ConnectedSocket() socket: Socket) {
		await this.gameService.onPlayerDisconnect(socket);
	}

	private async verifyUser(token: string): Promise<UserDto> {
		if (!token)
			return null;

		try {
			const verifiedToken = this.authService.verifyToken(token);
			const user = await this.usersService.findById(verifiedToken.sub);
			return toUserDto(user);
		} catch (err) {
			return undefined
		}
	}

	async handleConnection(client: any, ...args: any[]) {

		const user = await this.verifyUser(client.handshake.auth.token);
		if (!user) {
			Logger.log("WS: client is not verified. dropped.");
			return;
		}

		// attach the user to the socket
		client.data.user = user;

		// client joins its own rooms, so that we send messages to all his devices
		client.join("user" + user.id.toString());

	}

	handleDisconnect(client: any): any {
		this.gameService.onPlayerDisconnect(client);
	}

	async afterInit(server: Server) {
		Logger.log('WebSocket server initialized');
		await this.gameService.init(server);
	}

	@SubscribeMessage('reconnect')
	handleReconnect(@ConnectedSocket() client: Socket) {
		// Try to reconnect to current game if there is one
		this.gameService.tryToReconnect(client)
	}

	@SubscribeMessage('newJoinQueue')
	async handleJoinQueue(@MessageBody() joinQueueData: JoinQueueDto,
		@ConnectedSocket() client: Socket): Promise<string> {
		return await this.gameService.joinQueue(client, joinQueueData);
	}

	@SubscribeMessage('abortJoinQueue')
	async handleAbortQueue(@ConnectedSocket() client: Socket) {
		return await this.gameService.quitQueue(client);
	}

	@SubscribeMessage('playerReady')
	handlePlayerIsReady(@ConnectedSocket() client: Socket) {
		return this.gameService.playerIsReady(client);
	}

	@SubscribeMessage('invitePlayer')
	inviteSomebodyToPlay(@MessageBody() inviteSettings: InvitePlayer,
		@ConnectedSocket() client: Socket) {
		return this.gameService.inviteSomebodyToPlay(client, inviteSettings);
	}

	@SubscribeMessage('cancelInvitation')
	cancelInvitation(@MessageBody() inviteSettings: GameSettingsDto,
		@ConnectedSocket() client: Socket) {
		return this.gameService.cancelInvitation(client, inviteSettings);
	}

	@SubscribeMessage('acceptInvitation')
	acceptInvitation(@ConnectedSocket() client: Socket,
		@MessageBody() inviteSettings: GameSettingsDto) {
		return this.gameService.acceptInvitation(client, inviteSettings);
	}

	@SubscribeMessage('declineInvitation')
	declineInvitation(@ConnectedSocket() client: Socket,
		@MessageBody() inviteSettings: GameSettingsDto) {
		return this.gameService.declineInvitation(client, inviteSettings);
	}
	// }

}
