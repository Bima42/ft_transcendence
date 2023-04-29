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
import { UserChat, Chat, ChatType, ChatMessage, User} from '@prisma/client';
import { ChatMessageDto, NewChatMessageDto } from './dto/message.dto';
import { DetailedChannelDto, NewChannelDto } from './dto/channel.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {
  }

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
        orderBy: { id: "asc" },
      });
    }

    if (!channels) {
      throw new BadRequestException('No channel found');
    }

    if (channels.length == 0) {
      const general :NewChannelDto = {
          name: "General",
          type: 'PUBLIC',
      }
      // Create the default chat
      Logger.log("Generate the general chat");
      const generalChannel = await this.prismaService.chat.upsert({
        where: { id: 1 },
        create: general,
        update: general,
      })
      if (generalChannel) {
        channels.push(generalChannel);
      }
    }
    return channels;
  }

  // Return the detailed description of the chat, except for the messages
  async getChannelDetails(user: User, chatId: number): Promise<DetailedChannelDto | NewChannelDto> {

    const chat: Chat = await this.prismaService.chat.findUnique({
      where: { id: +chatId },
    });

    // TODO TYR: When the chat is not found

    const users = await this.prismaService.userChat.findMany({
      where: { chatId: chatId },
      select: {
        id: true,
        userId: true,
        user: true,
        chatId: true,
        role: true,
        mutedUntil: true
      },
      orderBy: [
        { role: "asc", },
        { userId: "desc", },
      ],
    })

    // Check that the user has access to the detailed chat
    const found = (users as UserChat[]).find((el: UserChat) => (el.userId == user.id && el.role != 'BANNED'));
    if (!found && !(chat.type == "PUBLIC" && !chat.password)) {
      const newDto : NewChannelDto = {
        name: chat.name,
        type: chat.type,
      };
      return newDto;
    }

    const chatDto: DetailedChannelDto = {
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
    const existingChannel = await this.findByName(newChannel.name);
    if (existingChannel) {
      return existingChannel;
    }

    // FIXME: hash password in the database !
    if (newChannel.password) {
      const saltRounds = 10;
      newChannel.password = await bcrypt.hash(newChannel.password, saltRounds);
    }

    const newChat = await this.prismaService.chat.create({
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

  async updateChannel(user: User, chatId: number, newChannel: NewChannelDto) {
    // Get the current role of the request user
    const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
    if (!reqUserChat || reqUserChat.role != 'OWNER'){
      throw new ForbiddenException('Not authorized to update Channel');
    }

    // FIXME: hash password in the database !
    // TODO: can we remove the channel password ?
    if (newChannel.password) {
      const saltRounds = 10;
      newChannel.password = await bcrypt.hash(newChannel.password, saltRounds);
    }

    return this.prismaService.chat.update({
      where: { id: chatId },
      data: newChannel
    });
  }

  async deleteChannel(user: User, chatId: number) {

    // Get the current role of the request user
    const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
    if (!reqUserChat || reqUserChat.role != 'OWNER'){
      throw new ForbiddenException('Not authorized to delete Channel');
    }

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

  async joinChannel(user: User, chatId: number, newData: NewChannelDto): Promise<DetailedChannelDto | NewChannelDto> {
    const chat : Chat = await this.findChannelById(chatId);


    // Cannot join private chat, must be added by an admin
    if (chat.type != 'PUBLIC')
      throw new ForbiddenException('Not authorized to join channel');

    // check password
    // FIXME: get password from hash in the database !
    if (newData.password && ! await bcrypt.compare(newData.password, chat.password)) {
      return newData;
    }

    // add userRole
    await this.prismaService.userChat.create({
      data: {
        role: "MEMBER",
        chatId: chatId,
        userId: user.id,
      }
    });

    // Return full chat (with users)
    const users = await this.prismaService.userChat.findMany({
      where: { chatId: chatId },
      select: {
        id: true,
        userId: true,
        user: true,
        chatId: true,
        role: true,
        mutedUntil: true
      },
      orderBy: [
        { role: "asc", },
        { userId: "desc", },
      ],
    })
    const chatDto: DetailedChannelDto = {
      id: chatId,
      name: chat.name,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      users: users,
    }
    return chatDto;
  }

    async leaveChannel(user: User, chatId: number) {

      Logger.log(`${user.username}#${user.id} wants to leave channel ${chatId}`);
      // Get the current role of the request user
      const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
      if (!reqUserChat || reqUserChat.role == 'BANNED'){
        throw new ForbiddenException('Not authorized to leave Channel');
      }

      // Check if the user is the OWNER before passing the role to another user
      if (reqUserChat.role === 'OWNER') {
        // Pass the OWNER role to the next user
        await this.passOwnerRole(chatId, user.id);
      }

      // delete userRole
      await this.prismaService.userChat.delete({
        where: { id: reqUserChat.id }
      });

      this.deleteChatIfEmpty(chatId);
    }

  async getLastMessages(chatId: number, nbrMsgs: number) {
    const chat = await this.findChannelById(chatId);
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
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
    });
  }

  async postMessage(user: UserDto, chatId: number, data: NewChatMessageDto): Promise<ChatMessageDto> {
    const chat = await this.findChannelById(chatId);
    if (!chat) {
      return Promise.reject("No chat");
    }

    // Check if user is allowed to post a message:
    let chatRole = await this.findUserchatFromIds(chatId, user.id);
    if (!chatRole) {
      if (chat.type == "PUBLIC" && !chat.password) {
        // Add the user to public chat
        chatRole = await this.prismaService.userChat.create({
          data: {
            chatId: chat.id,
            userId: user.id,
          }
        })
      } else {
        // Not a member of a private chat
        Logger.log("User is a stranger from chat");
        return Promise.reject("stranger");
      }
    }

    // Banned from chat
    if (chatRole.role == "BANNED")
      return Promise.reject("banned");
    // Muted
    if (chatRole.mutedUntil && (chatRole.mutedUntil as Date).getTime() > Date.now()) {
        return Promise.reject("muted");
    }

    const msg: ChatMessage = await this.prismaService.chatMessage.create({
      data: {
        content: data.content,
        user: { connect: { id: user.id } },
        chat: { connect: { id: chatId } }
      }
    });

    const msgDto : ChatMessageDto = {
      content: msg.content,
      sentAt: msg.sentAt,
      updatedAt: msg.updatedAt,
      chatId: msg.chatId,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    }
    return msgDto;
  }

  async deleteUserChatRole(user: User, chatId: number, targetUsername: string) {
    // Check current user permissions
    const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
    if (reqUserChat.role != 'ADMIN' && reqUserChat.role != 'OWNER') {
      throw new ForbiddenException('Not authorized to kick');
    }

    // Get the target user from username:
    const targetUser = await this.userService.findByName(targetUsername);

    // Get the current role of the target user
    const targetUserChat = await this.findUserchatFromIds(chatId, targetUser.id);

    // Cannot kick the owner
    if (targetUserChat.role == 'OWNER'){
      throw new ForbiddenException('Not authorized to kick');
    }

    // Cannot kick a banned user, otherwise it will reset its permissions and he
    // could rejoin the chat
    if (targetUserChat.role == UserChatRole.BANNED) {
      return HttpStatus.AMBIGUOUS;
    }

    Logger.log(`${user.username}#${user.id} kicked ${targetUser.username}#${targetUser.id} from chat ${chatId}`);
    await this.prismaService.userChat.delete({
      where: { id: targetUserChat.id },
    });
    return HttpStatus.OK;
  }

  async UpsertUserChatRole(user: User, chatId: number, targetUsername: string, newRole: UserChatRole, muteDuration: number | null): Promise<HttpStatus> {

    // Check current user permissions
    const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
    if (reqUserChat.role != 'ADMIN' && reqUserChat.role != 'OWNER') {
      throw new ForbiddenException('Not authorized to update role');
    }

    // Get the target user from username:
    const targetUser = await this.userService.findByName(targetUsername);

    // Get the current role of the target user
    const targetUserChat = await this.findUserchatFromIds(chatId, targetUser.id);

    if (!targetUserChat) {
      // Create the user role
      Logger.log(`${targetUser.username}#${targetUser.id}'s role is created for chat ${chatId}: ${newRole}`);
      const mutedUntil = this.updateMutedUntil(null, muteDuration);
      await this.prismaService.userChat.create({
        data: {
          chatId: chatId,
          userId: targetUser.id,
          role: newRole,
          mutedUntil: mutedUntil,
        }
      });
      return HttpStatus.OK;
    }

    if (targetUserChat.role == UserChatRole.OWNER) {
      Logger.log("Cannot change role from owner");
      throw new ForbiddenException("Owner is untouchable");
    }

    // Update user with new values:
    targetUserChat.role = newRole;
    targetUserChat.mutedUntil = this.updateMutedUntil(targetUserChat.mutedUntil, muteDuration);

    // Log
    let diffMuted = 0;
    const dateNow = new Date();
    if (targetUserChat.mutedUntil)
      diffMuted = (targetUserChat.mutedUntil.getTime() - dateNow.getTime()) / 1000;
    Logger.log(`${targetUser.username}#${targetUser.id}'s role is updated for chat ${chatId}: ${newRole} (muted for: ${diffMuted} sec)`);

    await this.prismaService.userChat.update({
      where: { id: targetUserChat.id },
      data: targetUserChat
    });
    return HttpStatus.OK;
  }

  updateMutedUntil(currentMutedUntil: Date | null, muteDuration: number) : Date | null {
    if (muteDuration) {
      const newMutedUntil = new Date();
      newMutedUntil.setSeconds(newMutedUntil.getSeconds() + muteDuration);
      if (!currentMutedUntil || newMutedUntil > currentMutedUntil) {
          return newMutedUntil;
      } else {
        return currentMutedUntil;
      }
    }
    // Check if the muted until is expired
    const dateNow = new Date();
    if (!currentMutedUntil || currentMutedUntil < dateNow)
      return null;

    return currentMutedUntil;
}

  async findUserchatFromIds(chatIdd: number, userIdd: number) : Promise<UserChat | null> {
    const userchat = await this.prismaService.userChat.findFirst ({
          where: {
              chatId: chatIdd,
              userId: userIdd,
          },
        });
    return userchat;
  }

  async deleteChatIfEmpty(chatId: number): Promise<void> {

    const chat = await this.prismaService.chat.findUnique ({
      where: { id: chatId },
      include: { users: true },
    });

    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }

    if (chat.users.length === 0 && !(chat.id == 1)) {
      Logger.log(`Chat ${chat.name} deleted because empty`);

      await this.prismaService.chatMessage.deleteMany({
        where: {
          chatId: chatId,
        },
      })
      await this.prismaService.chat.delete({
        where: {
          id: chatId,
        },
      });
    }
  }

  async passOwnerRole(chatId: number, leavingOwner: number): Promise<void> {
    // Find the user that will become the new owner
    const userChat = await this.prismaService.userChat.findFirst({
      where: {
        chatId: chatId,
        userId: { not: leavingOwner },
        role: { not: 'BANNED' },
      },
      orderBy: { id: 'asc' },
    });
    if (!userChat) {
      return
    }
    // Update the role of the user that will become the new owner
    await this.prismaService.userChat.update({
      where: { id: userChat.id },
      data: { role: 'OWNER' },
    });
  }
}
