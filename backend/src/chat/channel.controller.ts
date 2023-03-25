
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
import { Request } from 'express'
import { Chat, ChatMessage, UserChatRole, User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { NewMessageDto } from './dto/message.dto';
import { ChatAction, DetailedChannelDto, NewChannelDto } from './dto/channel.dto';
import { length } from 'class-validator';

@ApiTags('Chat')
@Controller('chat')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelGateway: ChatGateway,
  ){}

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

  @Put('rooms/:id/user')
  UpsertUserChat(@Req() req: Request, @Body() action: ChatAction, @Param('id', new ParseIntPipe()) chatId: number) {
    const user = req.user as User;
    switch (action.type) {
      case 'kick':
        this.channelService.deleteUserChatRole(user, chatId, action.username);
        break;
      case 'add':
      case 'demote':
        this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.MEMBER, null);
        break;
      case 'mute':
        if (!action.muteDuration)
          return ;
        this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.MEMBER, action.muteDuration);
        break;
      case 'ban':
        this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.BANNED, null);
        break;
      case 'promote':
        this.channelService.UpsertUserChatRole(user, chatId, action.username, UserChatRole.ADMIN, null);
      default:
        break;
    }
    this.channelGateway.server.emit("updateChannelList");
  }


}
