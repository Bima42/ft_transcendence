
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
    const whispers : boolean = (req.query.whispers ? JSON.parse(req.query.whispers as string) : false);
    return this.channelService.getAllChannelsForUser(req.user as User, whispers);
  }

  @Post('rooms')
  async createNewChannel(@Req() req: Request, @Body() data: NewChannelDto) : Promise<Chat> {
	  return this.channelService.createChannel(req.user as User, data)
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
  PostMessage(@Param('id', new ParseIntPipe()) id: number, @Req() req: Request, @Body() data: NewMessageDto) {
	  return this.channelService.postMessage(req.user as User, id, data);
  }

  @Put('rooms/:id/mute/:user')
  MuteUserToChat(@Req() req: Request, @Param('id', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
    let mutedUntil: Date = new Date();
    // TODO: specify a dynamic number of seconds muted
    mutedUntil.setSeconds(mutedUntil.getSeconds() + 20);
		return this.channelService.UpsertUserChatRole(req.user as User, chatId, userId, UserChatRole.MEMBER, mutedUntil);
	}

  @Put('rooms/:id/add/:user')
  AddUserToChat(@Req() req: Request, @Param('id', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(req.user as User, chatId, userId, UserChatRole.MEMBER, null);
	}

  @Put('rooms/:chat/kick/:user')
  KickUserFromChat(@Req() req: Request, @Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.deleteUserChatRole(req.user as User, chatId, userId)
	}

  @Put('rooms/:chat/ban/:user')
  BanUserFromChat(@Req() req: Request, @Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(req.user as User, chatId, userId, UserChatRole.BANNED, null)
	}

  @Put('rooms/:chat/promote/:user')
  PromoteUserFromChat(@Req() req: Request, @Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(req.user as User, chatId, userId, UserChatRole.ADMIN, null)
	}

  @Put('rooms/:chat/demote/:user')
  DemoteUserFromChat(@Req() req: Request, @Param('chat', new ParseIntPipe()) chatId: number,
				@Param('user', new ParseIntPipe()) userId: number) {
		return this.channelService.UpsertUserChatRole(req.user as User, chatId, userId, UserChatRole.MEMBER, null)
	}

	@Get('users/online')
	GetOnlineUsers() {
		return "me"
	}
}
