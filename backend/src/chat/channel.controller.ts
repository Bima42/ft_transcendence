
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NewChatMessageDto } from './dto/message.dto';
import { UserchatAction, DetailedChannelDto, NewChannelDto, JoinChannelDto } from './dto/channel.dto';
import { length } from 'class-validator';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth('JWT')
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
  async getOneChannel(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number) : Promise<DetailedChannelDto | NewChannelDto> {
	  return this.channelService.getChannelDetails(req.user as User, id);
  }

  @Put('rooms/:id')
  async updateChannel(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number, @Body() data: NewChannelDto) {
    return this.channelService.updateChannel(req.user as User, id, data);
  }

  @Delete('rooms/:id')
  async DeleteChannel(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number) {
    return this.channelService.deleteChannel(req.user as User, id);
  }

  @Put('rooms/join')
  async joinChannel(@Req() req: Request, @Body() data: JoinChannelDto) {
    return this.channelService.joinChannel(req.user as User, data);
  }

  @Put('rooms/leave')
  async leaveChannel(@Req() req: Request, @Body() data: JoinChannelDto) {
    return this.channelService.leaveChannel(req.user as User, data);
  }

  @Get('rooms/:id/messages')
  getOneChannelMessages(@Param('id', new ParseIntPipe()) id: number) {
	  return this.channelService.getLastMessages(id, 50);
  }

  @Post('rooms/:id/messages')
  PostMessage(@Param('id', new ParseIntPipe()) id: number, @Req() req: Request, @Body() data: NewChatMessageDto) {
	  return this.channelService.postMessage(req.user as User, id, data);
  }

  @Put('rooms/:id/user')
  async UpsertUserChat(@Req() req: Request, @Body() action: UserchatAction, @Param('id', new ParseIntPipe()) chatId: number) {
    const user = req.user as User;
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
          return ;
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
