
import { Body, Controller, Get, Delete, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Chat, ChatMessage, UserChatRole } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { NewMessageDto } from './dto/message.dto';
import { NewChannelDto } from './dto/channel.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('rooms')
  getAllChannels(): Promise<Chat[]> {
    return this.channelService.getAllChannels();
  }

  @Post('rooms')
  async createNewChannel(@Body() data: NewChannelDto) : Promise<Chat> {
	  return this.channelService.createChannel(data)
  }

  @Get('rooms/:id')
  async getOneChannel(@Param('id', new ParseIntPipe()) id: number): Promise<Chat> {
	  return this.channelService.findById(id);
  }

  @Put('rooms/:id')
  async updateChannel(@Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto) {
	return this.channelService.updateChannel(id, data);
  }

  @Delete('rooms/:id')
  async DeleteChannel(@Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto) {
	return this.channelService.deleteChannel(id);
  }

  @Get('rooms/:id/messages')
  getOneChannelMessages(@Param('id', new ParseIntPipe()) id: number): Promise<ChatMessage[]> {
	  return this.channelService.getMessages(id);
  }

  @Post('rooms/:id/messages')
  PostMessage(@Param('id', new ParseIntPipe()) id: number, @Body() data: NewMessageDto) {
	  return this.channelService.postMessage(id, data);
  }

  @Put('rooms/:id/mute/:user')
  MuteUserToChat(@Param('id', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(chatId, userId, UserChatRole.MEMBER, 10);
	}

  @Put('rooms/:id/add/:user')
  AddUserToChat(@Param('id', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(chatId, userId, UserChatRole.MEMBER, 0);
	}

  @Put('rooms/:chat/kick/:user')
  KickUserFromChat(@Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(chatId, userId, UserChatRole.BANNED, 0)
	}

  @Put('rooms/:chat/ban/:user')
  BanUserFromChat(@Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(chatId, userId, UserChatRole.BANNED, 0)
	}

	@Get('users/online')
	GetOnlineUsers() {
		return "me"
	}
}
