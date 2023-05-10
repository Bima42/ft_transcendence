import {
	Body,
	Controller,
	Get,
	Delete,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChatGateway } from './channel.gateway';
import { Chat, ChatMessage, UserChatRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatMessageDto, NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { UserchatAction, DetailedChannelDto, NewChannelDto, JoinChannelDto, NewWhisperDto } from './dto/channel.dto';
import { length } from 'class-validator';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { ApiBody } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth('JWT')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private channelGateway: ChatGateway,
	) {
	}

	@Get('rooms/public')
	async getPublicChannels(@Req() req: RequestWithUser): Promise<NewChannelDto[]> {
		return this.channelService.getPublicChannels(req.user);
	}

	@Get('rooms/whispers')
	async getWhisperChannels(@Req() req: RequestWithUser): Promise<DetailedChannelDto[]> {
		return await this.channelService.getWhisperChannels(req.user);
	}

	@Get('rooms/subscribed')
	async getSubscribedChannels(@Req() req: RequestWithUser): Promise<NewChannelDto[]> {
		return this.channelService.getSubscribedChannels(req.user);
	}

	@Get('rooms')
	getAllChannels(@Req() req: RequestWithUser): Promise<NewChannelDto[]> {
		const whispers: boolean = (req.query.whispers ? JSON.parse(req.query.whispers as string) : false);
		return this.channelService.getAllChannelsForUser(req.user, whispers);
	}

	@Post('rooms')
	async createNewChannel(@Req() req: RequestWithUser, @Body() data: NewChannelDto): Promise<DetailedChannelDto> {
		return this.channelService.createChannel(req.user, data)
	}
	@Post('rooms/whispers')
	async createNewWhisper(@Req() req: RequestWithUser, @Body() data: NewWhisperDto): Promise<DetailedChannelDto> {
		const chat = await this.channelService.createWhisperChat(req.user, data.targetUsername)
		return this.channelService.getChannelDetails(req.user, chat.id)
	}

	@Put('rooms/join')
	async joinChannel(@Req() req: RequestWithUser, @Body() data: JoinChannelDto) {
		return this.channelService.joinChannel(req.user, data);
	}

	@Put('rooms/leave')
	async leaveChannel(@Req() req: RequestWithUser, @Body() data: JoinChannelDto) {
		return this.channelService.leaveChannel(req.user, data);
	}

	@Get('rooms/subscriptions')
	GetSubscriptions(@Req() req: RequestWithUser) {
		return this.channelService.getSubscribedChannels(req.user);
	}

	@Post('rooms/editChannelName')
	@ApiBody({ required: true })
	async changeChatName(@Req() req: RequestWithUser, @Body() data: { id: number, newName: string }) {
		return this.channelService.changeChatName(req.user, data.id, data.newName);
	}

	@Get('rooms/:id')
	async getOneChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number): Promise<DetailedChannelDto> {
		return this.channelService.getChannelDetails(req.user, id);
	}

	@Put('rooms/:id')
	async updateChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto): Promise<DetailedChannelDto> {
		return this.channelService.updateChannel(req.user, id, data);
	}

	@Delete('rooms/:id')
	async DeleteChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.deleteChannel(req.user, id);
	}

	@Get('rooms/:id/messages')
	getOneChannelMessages(@Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.getLastMessages(id, 50);
	}

	@Post('rooms/:id/messages')
	PostMessage(@Param('id', new ParseIntPipe()) id: number, @Req() req: RequestWithUser, @Body() data: NewChatMessageDto) {
		return this.channelService.postMessage(req.user, id, data);
	}

	// TODO: remove :id
	@Post('whisper/messages')
	PostWhisperMessage(@Req() req: RequestWithUser, @Body() data: NewWhisperMessageDto) {
		Logger.log("New Whisper message")
		const user = req.user;
		this.channelService.postMessageInWhisperChat(req.user, data)
			.then((msg: ChatMessage) => {
				const msgDto: ChatMessageDto = {
					content: msg.content,
					sentAt: msg.sentAt,
					updatedAt: msg.updatedAt,
					chatId: msg.chatId,
					author: {
						id: user.id,
						username: user.username,
						avatar: user.avatar
					}
				}
				return msgDto;
			})
			.catch((e) => {
				return "Cannot post whisper message: " + e
			});
	}

	@Put('rooms/:id/user')
	async UpsertUserChat(@Req() req: RequestWithUser, @Body() action: UserchatAction, @Param('id', new ParseIntPipe()) chatId: number) {
		const user = req.user;
		switch (action.type) {
			case 'kick':
				await this.channelService.deleteUserChatRole(user, chatId, action.username);
				break;
			case 'add':
			case 'demote':
				await this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.MEMBER, null);
				break;
			case 'mute':
				if (!action.muteDuration)
					return;
				await this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.MEMBER, action.muteDuration);
				break;
			case 'ban':
				await this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.BANNED, null);
				break;
			case 'promote':
				await this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.ADMIN, null);
			default:
				break;
		}
		const userchat = await this.channelService.getChannelDetails(user, chatId);
		this.channelGateway.server.emit('updateChannelList', userchat);
	}

	@Get('rooms/:id/isPasswordProtected')
	async isPasswordProtected(@Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.isPasswordProtected(id);
	}
}
