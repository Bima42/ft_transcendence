import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
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

    // Cfeate owner role for user
    await this.prismaService.userChat.create({
      data: {
        role: "OWNER",
        chatId: newChat.id,
        userId: user.id,
      }
    });
    Logger.log(`${user.username}#${user.id} created a new chat ${newChat.type} : ${newChat.name}#${newChat.id}`);
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

  async deleteUserChatRole(user: User, chatId: number, targetUsername: string) {
    // Get the current role of the request user
    const reqUserChat = await this.prismaService.userChat.findFirst ({
      where: {
          chatId: chatId,
          userId: user.id,
      },
    });
    if (!reqUserChat || (reqUserChat.role != 'ADMIN' && reqUserChat.role != 'OWNER')){
      throw new ForbiddenException('Not authorized to kick');
    }

    // Get the target user from username:
    const targetUser = await this.prismaService.user.findUnique({
      where: {
        username: targetUsername,
      }
    });
    if (!targetUser) {
      throw new NotFoundException('target user not found');
    }

    // Get the current role of the target user
    var targetUserChat = await this.prismaService.userChat.findFirst({
      where: {
        chatId: chatId,
        userId: targetUser.id,
      },
      include: {
        user: true
      },
    });
    if (!targetUserChat) {
      throw new NotFoundException('target userchat not found');
    }
    // Admin cannot kick the owner
    if (reqUserChat.role == 'ADMIN' && targetUserChat.role == 'OWNER'){
      throw new ForbiddenException('Not authorized to kick');
    }

    // Cannot kick a banned user, otherwise it will reset its permissions and he
    // could rejoin the chat
    if (targetUserChat.role != UserChatRole.BANNED) {
      Logger.log(`${user.username}#${user.id} kicked ${targetUserChat.user.username}#${targetUserChat.user.id} from chat ${chatId}`);
      await this.prismaService.userChat.delete({
        where: { id: targetUserChat.id },
      });
    }
    return HttpStatus.OK;
  }

  async UpsertUserChatRole(user: User, chatId: number, targetUsername: string, newRole: UserChatRole, muteDuration: number | null): Promise<HttpStatus> {
    // Get the current role of the request user
    const reqUserChat = await this.prismaService.userChat.findFirst ({
      where: {
          chatId: chatId,
          userId: user.id,
      },
    });
    if (!reqUserChat || (reqUserChat.role != 'ADMIN' && reqUserChat.role != 'OWNER')){
      throw new ForbiddenException('Not authorized to update role');
    }

    // Get the target user from username:
    const targetUser = await this.prismaService.user.findUnique({
      where: {
        username: targetUsername,
      }
    });
    if (!targetUser) {
      throw new NotFoundException('target user not found');
    }

    // Get the current role of the target user
    var targetUserChat = await this.prismaService.userChat.findFirst({
      where: {
        AND: [
          { chatId: chatId },
          { userId: targetUser.id }
        ]
      },
    });
    if (!targetUserChat) {
      Logger.log(`${targetUser.username}#${targetUser.id}'s role is created for chat ${chatId}: ${newRole}`);
      await this.prismaService.userChat.create({
        data: {
          chatId: chatId,
          userId: targetUser.id,
          role: newRole,
        }
      });
      return HttpStatus.OK;
    }

    if (targetUserChat.role == UserChatRole.OWNER) {
      Logger.log("Cannot change role from owner");
      throw new ForbiddenException("Owner is untouchable");
    }

    targetUserChat.role = newRole;

    // Update the mutedUntil
    if (muteDuration) {
      let newMutedUntil = new Date();
      newMutedUntil.setSeconds(newMutedUntil.getSeconds() + muteDuration);
      // If already muted, check if done or not
      if (!targetUserChat.mutedUntil || newMutedUntil > targetUserChat.mutedUntil) {
          targetUserChat.mutedUntil = newMutedUntil;
      }
    }
    // Check if the muted until is expired
    const dateNow = new Date();
    if (targetUserChat.mutedUntil < dateNow)
      targetUserChat.mutedUntil = null;


    let diffMuted = 0;
    if (targetUserChat.mutedUntil)
      diffMuted = (targetUserChat.mutedUntil.getTime() - dateNow.getTime()) / 1000;
    Logger.log(`${targetUser.username}#${targetUser.id}'s role is updated for chat ${chatId}: ${newRole} (muted for: ${diffMuted} sec)`);

    await this.prismaService.userChat.update({
      where: { id: targetUserChat.id },
      data: targetUserChat
    });
    return HttpStatus.OK;
  }
}
