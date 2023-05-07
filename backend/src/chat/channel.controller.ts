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
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChatGateway } from './channel.gateway';
import { Chat, UserChatRole, User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NewChatMessageDto } from './dto/message.dto';
import { UserchatAction, DetailedChannelDto, NewChannelDto } from './dto/channel.dto';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth('JWT')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private channelGateway: ChatGateway,
	) {
	}

	@Get('rooms')
	getAllChannels(@Req() req: RequestWithUser): Promise<NewChannelDto[]> {
		const whispers: boolean = (req.query.whispers ? JSON.parse(req.query.whispers as string) : false);
		return this.channelService.getAllChannelsForUser(req.user, whispers);
	}

	@Post('rooms')
	async createNewChannel(@Req() req: RequestWithUser, @Body() data: NewChannelDto): Promise<Chat> {
		return this.channelService.createChannel(req.user, data)
	}

	@Get('rooms/:id')
	async getOneChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number): Promise<DetailedChannelDto | NewChannelDto> {
		return this.channelService.getChannelDetails(req.user, id);
	}

	@Put('rooms/:id')
	async updateChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto) {
		return this.channelService.updateChannel(req.user, id, data);
	}

	@Delete('rooms/:id')
	async DeleteChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.deleteChannel(req.user, id);
	}

	@Put('rooms/:id/join')
	async joinChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto) {
		return this.channelService.joinChannel(req.user, id, data);
	}

	@Put('rooms/:id/leave')
	async leaveChannel(@Req() req: RequestWithUser, @Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.leaveChannel(req.user, id);
	}

	@Get('rooms/:id/messages')
	getOneChannelMessages(@Param('id', new ParseIntPipe()) id: number) {
		return this.channelService.getLastMessages(id, 50);
	}

	@Post('rooms/:id/messages')
	PostMessage(@Param('id', new ParseIntPipe()) id: number, @Req() req: RequestWithUser, @Body() data: NewChatMessageDto) {
		return this.channelService.postMessage(req.user, id, data);
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
		this.channelGateway.server.emit("updateChannelList", userchat);
	}


}
