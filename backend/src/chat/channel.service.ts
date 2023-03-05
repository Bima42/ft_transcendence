
import { BadRequestException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { Prisma, UserChatRole } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatMessage} from '@prisma/client';
import { NewMessageDto } from './dto/message.dto';
import { NewChannelDto } from './dto/channel.dto';

@Injectable()
export class ChannelService {
  constructor(
      private readonly prismaService: PrismaService
  ) {}

  async getAllChannels(): Promise<Array<Chat>> {
    const channels = await this.prismaService.chat.findMany();

    if (!channels) {
      throw new BadRequestException('No channel found');
    }

    return channels;
  }

  async findById(chatId: number): Promise<Chat> {
		return this.prismaService.chat.findUnique({
			where: { id: +chatId }
		});
  }

  async findByName(chatName : string): Promise<Chat> {
	  return this.prismaService.chat.findFirst({
		  where: { name: chatName}
	  });
  }

  async createChannel(newChannel: NewChannelDto): Promise<Chat> {
	let existingChannel = await this.findByName(newChannel.name);
	if (existingChannel) {
		return existingChannel;
	}

    let newChat = await this.prismaService.chat.create({
      data: newChannel
    });

    return newChat;
  }

  async updateChannel(chatId: number, newData: NewChannelDto) {
	return this.prismaService.chat.update({
		where: { id: chatId },
		data: newData
	});
  }

  async getMessages(chatId: number): Promise<Array<ChatMessage>> {
	  let chat = await this.findById(chatId);
	  if ( ! chat)
		  return [];
	return this.prismaService.chatMessage.findMany({
		skip: 0,
		take: 50,
		where: { chatId: chatId },
		orderBy: { id: "desc" }
	});
  }

  async postMessage(chatId: number, data: NewMessageDto): Promise<HttpStatus> {
	  let chat = await this.findById(chatId);
	  if ( ! chat ) {
		  return HttpStatus.NOT_FOUND;
	  }
	await this.prismaService.chatMessage.create({
		data: {
			content: data.content,
			user: { connect: {id: 1}},
			chat: { connect: {id: chatId}}}});
	return HttpStatus.OK;
  }

  async UpsertUserChatRole(chatId: number, userId: number, role: UserChatRole, mutedUntil): Promise<HttpStatus> {
	var userChat = await this.prismaService.userChat.findFirst({
		where: {
			AND: [
				{ chatId: chatId} ,
				{ userId: userId}
			]}
	});
	if ( userChat ) {
		userChat.role = role;
		Logger.log("Update UserChat " + userChat.id + ": " + role);
		// this.prismaService.userChat.update({
		// 	where: {id: userChat.id},
		// 	data: userChat
		// });
	} else {
		Logger.log("New UserChat (" + userId + " on " + chatId + "): " + role);
		var uuuu = await this.prismaService.userChat.create({
			data: {
				chatId: chatId,
				userId: userId,
				role: role,
				mutedUntil: null
			}
		});
		return uuuu ? HttpStatus.OK : HttpStatus.NOT_MODIFIED;
	}
	return HttpStatus.OK;
  }
}
