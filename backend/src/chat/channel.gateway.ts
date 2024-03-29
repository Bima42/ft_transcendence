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
import { UserStatus } from '@prisma/client';

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

	/**
	 * When a client connects to the server, this method is called to
	 * verify the user and attach it to the socket
	 * Then, the user is added to the rooms he is subscribed to
	 *
	 * @param socket
	 * @param args
	 */
	async handleConnection(socket: any, ...args: any[]) {

		const user = await this.verifyUser(socket.handshake.auth.token);
		if (!user) {
			Logger.log("WS: client is not identified. dropped.");
			return;
		}

		Logger.log(`${user.username}#${user.id} connected`);

		// attach the user to the socket
		socket.data.user = user;

		socket.join("user" + user.id.toString())
		socket.join("friendRequest" + user.id.toString())

		const subscriptions = await this.channelService.getSubscribedChannels(user);
		const whispers = await this.channelService.getWhisperChannels(user)
		for (const chan of subscriptions) {
			socket.join("channel" + chan.id.toString())
		}
		for (const chan of whispers) {
			socket.join("channel" + chan.id.toString())
		}
		const blockedUsers = await this.friendService.getAllBlockedUsers(user.id)
		for (const user of blockedUsers) {
			socket.join("block" + user.id.toString())
		}
		const friends = await this.friendService.getAllFriends(user.id)
		for (const friend of friends) {
			socket.join("friend" + friend.id.toString())
		}

		/*******************************************
		 * 			NOTIFICATIONS ON CONNECT	   *
		 *******************************************/
		if (user.status !== UserStatus.OFFLINE)
			return;
		socket.to("friend" + user.id.toString()).emit("friendOnline", user)
		await this.usersService.updateData(user.id, { status: UserStatus.ONLINE });
	}

	handleDisconnect(socket: any): any {
		if (socket.data.user) {
			Logger.log(`${socket.data.user.username}#${socket.data.user.id} disconnected`);
		}
	}

	async onChannelJoin(user: UserDto, chatId: number) {
		this.server.in("user" + user.id.toString()).socketsJoin("channel" + chatId.toString())
	}

	async onChannelDelete(chatId: number) {
		this.server.socketsLeave("channel" + chatId.toString())
	}

	async onChannelLeave(user: UserDto, chatId: number) {
		this.server.in("user" + user.id.toString()).socketsLeave("channel" + chatId.toString())
	}

	async onChannelBanned(user: UserDto, chatId: number) {
		this.onChannelLeave(user, chatId)
		this.server.to("user" + user.id).emit("channelBanned", chatId)
	}

	async onChannelKicked(user: UserDto, chatId: number) {
		this.onChannelLeave(user, chatId)
		this.server.to("user" + user.id).emit("channelKicked", chatId)
	}

	async onChannelMuted(user: UserDto, chatId: number, muteDuration: number) {
		this.server.to("user" + user.id).emit("channelMuted", {chatId, muteDuration})
	}

	async onBlockUser(user: UserDto, targetUserId: number) {
		this.server.in("user" + user.id.toString()).socketsJoin("block" + targetUserId.toString())
	}

	async onUnblockUser(user: UserDto, targetUserId: number) {
		this.server.in("user" + user.id.toString()).socketsLeave("block" + targetUserId.toString())
	}

	async onNewFriend(user: UserDto, targetUserId: number) {
		this.server.in("user" + user.id.toString()).socketsJoin("friend" + targetUserId.toString())
		this.server.in("user" + targetUserId.toString()).socketsJoin("friend" + user.id.toString())
		this.server.to("user" + targetUserId.toString()).emit("friendshipAccepted", user)
	}

	async onRemoveFriend(user: UserDto, targetUserId: number) {
		this.server.in("user" + user.id.toString()).socketsLeave("friend" + targetUserId.toString())
		this.server.in("user" + targetUserId.toString()).socketsLeave("friend" + user.id.toString())
		this.server.to("user" + targetUserId.toString()).emit("friendshipRemoved", user)
	}

	async onNewFriendRequest(user: UserDto, targetUserId: number) {
		this.server.to("friendRequest" + targetUserId.toString()).emit("friendRequest", user)
	}

	async onCancelFriendRequest(user: UserDto, targetUserId: number) {
		this.server.to("friendRequest" + targetUserId.toString()).emit("friendRequestCanceled", user)
	}

	async onDeclineFriendRequest(user: UserDto, targetUserId: number) {
		this.server.to("friendRequest" + targetUserId.toString()).emit("friendRequestDeclined", user)
	}
};
