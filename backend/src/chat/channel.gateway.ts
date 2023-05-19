import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { ChannelService } from './channel.service'
import { NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { toUserDto } from '../shared/mapper/user.mapper';
import { FriendsService } from 'src/users/friends/friends.service';

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
		private readonly channelService: ChannelService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly friendService: FriendsService,
	) { }

	@SubscribeMessage('msg')
	async handleEvent(@MessageBody() data: NewChatMessageDto,
		@ConnectedSocket() socket: Socket) {

		const user = socket.data.user
		Logger.log(`New message from ${user.username}#${user.id} on chat ${data.chatId}`);
		const msg = this.channelService.postMessage(user, data.chatId, data)
			.then(msg => {
				// The server also send back to the sender, as acknowledgement and validation
				this.server
					.to("channel" + msg.chatId.toString())
					.except("block" + msg.author.id.toString())
					.emit("msg", msg);
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
		const msg = this.channelService.postMessageInWhisperChat(socket.data.user, data)
			.then(msg => {
				// The server also send back to the sender, as acknowledgement and validation
				this.server
					.to("channel" + msg.chatId.toString())
					.except("block" + msg.author.id.toString())
					.emit("msg", msg);
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
			Logger.log("WS: client is not identified. dropped.");
			return;
		}

		Logger.log(`Chat: ${user.username}#${user.id} connected`);

		// attach the user to the socket
		client.data.user = user;

		client.join("user" + user.id.toString())
		const subscriptions = await this.channelService.getSubscribedChannels(user);
		const whispers = await this.channelService.getWhisperChannels(user)
		for (const chan of subscriptions) {
			client.join("channel" + chan.id.toString())
		}
		for (const chan of whispers) {
			client.join("channel" + chan.id.toString())
		}
		const blockedUsers = await this.friendService.getAllBlockedUsers(user.id)
		for (const user of blockedUsers) {
			client.join("block" + user.id.toString())
		}
	}

	handleDisconnect(client: any): any {

		if (client.data.user) {
			Logger.log(`Chat: ${client.data.user.username}#${client.data.user.id} disconnected`);
		}

		//TODO: set user status offline
		//TODO: send notifications to all users to change his status to offline
	}

	async onChannelJoin(user: UserDto, chatId: number) {
		const sockets = await this.server.in("user" + user.id.toString()).fetchSockets()
		for (const socket of sockets) {
			socket.join("channel" + chatId.toString())
		}
	}

	async onChannelLeave(user: UserDto, chatId: number) {
		const sockets = await this.server.in("user" + user.id.toString()).fetchSockets()
		for (const socket of sockets) {
			socket.leave("channel" + chatId.toString())
		}
	}

	async onBlockUser(user: UserDto, targetUserId: number) {
		const sockets = await this.server.in("user" + user.id.toString()).fetchSockets()
		for (const socket of sockets) {
			socket.join("block" + targetUserId.toString())
		}
	}

	async onUnblockUser(user: UserDto, targetUserId: number) {
		const sockets = await this.server.in("user" + user.id.toString()).fetchSockets()
		for (const socket of sockets) {
			socket.leave("block" + targetUserId.toString())
		}
	}
};
