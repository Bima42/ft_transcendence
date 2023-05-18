import {
	Body,
	Controller,
	Get,
	Delete,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChatGateway } from './channel.gateway';
import { UserChatRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatMessageDto, NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { UserchatAction, DetailedChannelDto, NewChannelDto, JoinChannelDto, NewWhisperDto, UpdateChannelDto } from './dto/channel.dto';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { UsersService } from 'src/users/users.service';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth('JWT')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private channelGateway: ChatGateway,
		private usersService: UsersService
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
		const chat = await this.channelService.createChannel(req.user, data)
		this.channelGateway.onChannelJoin(req.user, chat.id)
		return chat
	}

	@Patch('rooms')
	async updateChannel(@Req() req: RequestWithUser, @Body() data: UpdateChannelDto): Promise<DetailedChannelDto> {
		return this.channelService.updateChannel(req.user, data);
	}

	@Post('rooms/whispers')
	async createNewWhisper(@Req() req: RequestWithUser, @Body() data: NewWhisperDto): Promise<DetailedChannelDto> {
		const chat = await this.channelService.createWhisperChat(req.user, data.targetUsername)
		this.channelGateway.onChannelJoin(req.user, chat.id)
		return this.channelService.getChannelDetails(req.user, chat.id)
	}

	@Put('rooms/join')
	async joinChannel(@Req() req: RequestWithUser, @Body() data: JoinChannelDto): Promise<DetailedChannelDto> {
		const chat = await this.channelService.joinChannel(req.user, data);
		this.channelGateway.onChannelJoin(req.user, chat.id)
		return chat
	}

	@Put('rooms/leave')
	async leaveChannel(@Req() req: RequestWithUser, @Body() data: JoinChannelDto) {
		await this.channelService.leaveChannel(req.user, data);
		this.channelGateway.onChannelLeave(req.user, data.chatId)
		return
	}

	@Get('rooms/subscriptions')
	GetSubscriptions(@Req() req: RequestWithUser) {
		return this.channelService.getSubscribedChannels(req.user);
	}

	@Get('rooms/:id')
	async getOneChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number): Promise<DetailedChannelDto> {
		return this.channelService.getChannelDetails(req.user, id);
	}

	@Delete('rooms/:id')
	async DeleteChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number) {
		await this.channelService.deleteChannel(req.user, id);
		this.channelGateway.onChannelLeave(req.user, id)
		return
	}

	@Get('rooms/:id/messages')
	getOneChannelMessages(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.getLastMessages(req.user.id, id, 50);
	}

	@Post('rooms/:id/messages')
	async PostMessage(@Param('id', new ParseIntPipe()) id: number, @Req() req: RequestWithUser, @Body() data: NewChatMessageDto): Promise<ChatMessageDto> {
		return this.channelService.postMessage(req.user, id, data);
	}

	@Post('whisper/messages')
	async PostWhisperMessage(@Req() req: RequestWithUser, @Body() data: NewWhisperMessageDto): Promise<ChatMessageDto> {
		return this.channelService.postMessageInWhisperChat(req.user, data)
	}

	@Put('rooms/:id/user')
	async UpsertUserChat(@Req() req: RequestWithUser, @Body() action: UserchatAction, @Param('id', new ParseIntPipe()) chatId: number) {
		const user = req.user;
		const targetUser = await this.usersService.findByName(action.username);
		switch (action.type) {
			case 'kick':
				await this.channelService.deleteUserChatRole(user, chatId, targetUser);
				await this.channelGateway.onChannelLeave(targetUser, chatId)
				break;
			case 'add':
			case 'demote':
				await this.channelService.UpsertUserChatRole(user, chatId, targetUser, UserChatRole.MEMBER, null);
				await this.channelGateway.onChannelJoin(targetUser, chatId)
				break;
			case 'mute':
				if (!action.muteDuration)
					return;
				await this.channelService.UpsertUserChatRole(user, chatId, targetUser, UserChatRole.MEMBER, action.muteDuration);
				await this.channelGateway.onChannelJoin(targetUser, chatId)
				break;
			case 'ban':
				await this.channelService.UpsertUserChatRole(user, chatId, targetUser, UserChatRole.BANNED, null);
				await this.channelGateway.onChannelLeave(targetUser, chatId)
				break;
			case 'promote':
				await this.channelService.UpsertUserChatRole(user, chatId, targetUser, UserChatRole.ADMIN, null);
				await this.channelGateway.onChannelJoin(targetUser, chatId)
			default:
				break;
		}
	}

	@Get('rooms/:id/isPasswordProtected')
	async isPasswordProtected(@Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.isPasswordProtected(id);
	}
}
