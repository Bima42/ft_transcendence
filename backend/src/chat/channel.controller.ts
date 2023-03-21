
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
import { Request } from 'express'
import { Chat, ChatMessage, UserChatRole, User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { NewMessageDto } from './dto/message.dto';
import { DetailedChannelDto, NewChannelDto } from './dto/channel.dto';
import { length } from 'class-validator';

@ApiTags('Chat')
@Controller('chat')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('rooms')
  getAllChannels(@Req() req: Request): Promise<NewChannelDto[]> {
    return this.channelService.getAllChannelsForUser(req.user as User);
  }

  @Post('rooms')
  async createNewChannel(@Body() data: NewChannelDto) : Promise<Chat> {
	  return this.channelService.createChannel(data)
  }

  @Get('rooms/:id')
  async getOneChannel(@Param('id', new ParseIntPipe()) id: number) : Promise<DetailedChannelDto> {
	  return this.channelService.getChannelDetails(id);
  }

  @Put('rooms/:id')
  async updateChannel(@Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto) {
	return this.channelService.updateChannel(id, data);
  }

  @Delete('rooms/:id')
  async DeleteChannel(@Param('id', new ParseIntPipe()) id: number) {
	return this.channelService.deleteChannel(id);
  }

  @Get('rooms/:id/messages')
  getOneChannelMessages(@Param('id', new ParseIntPipe()) id: number) {
	  return this.channelService.getLastMessages(id, 50);
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
		return this.channelService.deleteUserChatRole(chatId, userId)
	}

  @Put('rooms/:chat/ban/:user')
  // FIXME: not working
  BanUserFromChat(@Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(chatId, userId, UserChatRole.BANNED, 0)
	}

	@Get('users/online')
	GetOnlineUsers() {
		return "me"
	}
}
