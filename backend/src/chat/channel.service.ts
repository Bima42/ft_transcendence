
import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma, UserChatRole } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatType, ChatMessage, User} from '@prisma/client';
import { NewMessageDto } from './dto/message.dto';
import { DetailedChannelDto, NewChannelDto } from './dto/channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async getAllChannelsForUser(user: User, whispers: boolean): Promise<Array<NewChannelDto>> {
    let channels: Chat[] = [];
    if (whispers) {
      channels = await this.prismaService.chat.findMany({
        where: {
          // Whispers and user is in
          type: { equals: 'WHISPER' },
          users: {
            some: {
              userId: { equals: user.id },
            },
          },
        },
      });
    } else { // Retrieve community channels where the user is allowed, which is:
      channels = await this.prismaService.chat.findMany({
        where: {
          // Exclude all channel where the user is banned
          NOT: {
            users: {
              some: {
                userId: { equals: user.id },
                role: { equals: 'BANNED' },
              },
            },
          },
          OR: [
            // Public channels
            {
              type: { equals: 'PUBLIC' },
            },
            // Private channels, where user exists and is not banned
            {
              type: { equals: 'PRIVATE' },
              users: {
                some: {
                  userId: { equals: user.id },
                },
              },
            },

            ],
        },
      });
    }

    if (!channels) {
      throw new BadRequestException('No channel found');
    }

    return channels;
  }

  // Return the detailed description of the chat, except for the messages
  async getChannelDetails(chatId: number): Promise<DetailedChannelDto> {
    let chat = await this.prismaService.chat.findUnique({
      where: { id: +chatId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // TODO TYR: When the chat is not found

    let users = await this.prismaService.userChat.findMany({
      where: { chatId: chatId },
      select: {
        userId: true,
        user: true,
        chatId: true,
        role: true,
        mutedUntil: true
      }
    })
    let chatDto: DetailedChannelDto = {
      id: chatId,
      name: chat.name,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      users: users,
    }

    return chatDto;
  }

  async findChannelById(chatId: number): Promise<Chat> {
    return this.prismaService.chat.findUnique({
      where: { id: +chatId }
    });
  }

  async findByName(chatName: string): Promise<Chat> {
    return this.prismaService.chat.findFirst({
      where: { name: chatName }
    });
  }

  async createChannel(user: User, newChannel: NewChannelDto): Promise<Chat> {
    let existingChannel = await this.findByName(newChannel.name);
    if (existingChannel) {
      return existingChannel;
    }

    let newChat = await this.prismaService.chat.create({
      data: newChannel
    });

    this.UpsertUserChatRole(newChat.id, user.id, UserChatRole.OWNER, 0);
    return newChat;
  }

  async updateChannel(chatId: number, newData: NewChannelDto) {
    return this.prismaService.chat.update({
      where: { id: chatId },
      data: newData
    });
  }

  async deleteChannel(chatId: number) {

    // Delete UserChatRole
    const roleOutput = await this.prismaService.userChat.deleteMany({
      where: { chatId: chatId }
    })

    // Delete messages
    const MsgOutput = await this.prismaService.chatMessage.deleteMany({
      where: { chatId: chatId }
    })

    // Delete Chat
    this.prismaService.chat.delete({
      where: { id: chatId },
    });

    Logger.log("Deleted chat " + chatId + ": "
      + roleOutput.count + " roles and " + MsgOutput.count + " messages erased");

  }

  async getLastMessages(chatId: number, nbrMsgs: number) {
    let chat = await this.findChannelById(chatId);
    if (!chat)
      return [];
    Logger.log("returning some message");
    return this.prismaService.chatMessage.findMany({
      skip: 0,
      take: nbrMsgs,
      where: { chatId: chatId },
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      // select: {
      // 	content: true,
      // 	userId: true,
      // 	user: true
      // }
    });
  }

  async postMessage(user: User, chatId: number, data: NewMessageDto): Promise<ChatMessage> {
    const chat = await this.findChannelById(chatId);
    if (!chat) {
      return Promise.reject("No chat");
    }

    // Check if user is allowed to post a message:
    const chatRole = await this.prismaService.userChat.findFirst({
      where: {
        chatId: chat.id,
        userId: user.id
      }
    });
    // Not a member of a private chat
    if (!chatRole && chat.type != "PUBLIC")
      return Promise.reject("stranger");
    // Banned from chat
    if (chatRole && chatRole.role == "BANNED")
      return Promise.reject("banned");
    // Muted
    if (chatRole && chatRole.mutedUntil) {
      if ((chatRole.mutedUntil as Date).getTime() > Date.now())
        return Promise.reject("muted");
      else // Unmute
        this.UpsertUserChatRole(chatId, user.id, chatRole.role, null);
    }

    const msg = await this.prismaService.chatMessage.create({
      data: {
        content: data.content,
        user: { connect: { id: user.id } },
        chat: { connect: { id: chatId } }
      }
    });
    return msg;
  }

  async deleteUserChatRole(chatId: number, userId: number) {
    var userChat = await this.prismaService.userChat.findFirst({
      where: {
        AND: [
          { chatId: chatId },
          { userId: userId }
        ]
      }
    });
    if (userChat && userChat.role != UserChatRole.BANNED) {
      Logger.log("chat: " + chatId + "kick user: " + userId);
      await this.prismaService.userChat.delete({
        where: { id: userChat.id },
      });
    }
    return HttpStatus.OK;
  }

  async UpsertUserChatRole(chatId: number, userId: number, newRole: UserChatRole, mutedUntil: Date): Promise<HttpStatus> {
    var userChat = await this.prismaService.userChat.findFirst({
      where: {
        AND: [
          { chatId: chatId },
          { userId: userId }
        ]
      }
    });
    if (!userChat) {
      Logger.log("New role: chat: " + chatId + ", user: " + userId + ", role: " + newRole);
      var uuuu = await this.prismaService.userChat.create({
        data: {
          chatId: chatId,
          userId: userId,
          role: newRole,
        }
      });
      return uuuu ? HttpStatus.OK : HttpStatus.NOT_MODIFIED;
    }

    Logger.log("Oold role: " + userChat.role);
    if (userChat.role == UserChatRole.OWNER) {
      Logger.log("Cannot change role from owner");
      return HttpStatus.FORBIDDEN;
    }

    userChat.role = newRole;
    userChat.mutedUntil = mutedUntil;
    Logger.log("Update role: chat: " + chatId + ", user: " + userId + ", role: " + newRole);
    await this.prismaService.userChat.update({
      where: { id: userChat.id },
      data: userChat
    });
    return HttpStatus.OK;
  }
}
