
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatMessage, User } from '@prisma/client';
import { ChatMessageDto, NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { ChannelService } from './channel.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly channelService: ChannelService,
  ) {
  }

  async getLastMessages(chatId: number, nbrMsgs: number): Promise<ChatMessageDto[]> {
    let chat = await this.channelService.findChannelById(chatId);
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

  async postMessageInWhisperChat(user: User, data: NewWhisperMessageDto): Promise<ChatMessage> {
    try {
      let chat = await this.prismaService.chat.findFirst({
        where: {
          type: 'WHISPER',
          users: {
            none: {
              userId: { notIn: [user.id, data.receiverId] },
            },
          },
        },
      })
      if (!chat) {
        Logger.log("Creating new whisper chat")
        chat = await this.channelService.createWhisperChat(user.id, data.receiverId)
      }
      if (!chat) {
        Logger.log("Cannot create chat")
        return Promise.reject("cannot create whisper chat")
      }
      const msg: ChatMessage = await this.prismaService.chatMessage.create({
        data: {
          content: data.content,
          user: { connect: { id: user.id } },
          chat: { connect: { id: chat.id } }
        }
      });
      return msg;
    }
    catch (error) {
      Logger.error(error)
      return Promise.reject("cannot post message")
    }
  }

  async postMessageInGroupChat(user: User, data: NewChatMessageDto): Promise<ChatMessageDto> {
    const chat = await this.channelService.findChannelById(data.chatId);
    if (!chat || chat.type == "WHISPER")
      return Promise.reject("Wrong chat id");

    // Check if user is allowed to post a message:
    var chatRole = await this.channelService.findUserchatFromIds(chat.id, user.id);
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
    try {
      const msg: ChatMessage = await this.prismaService.chatMessage.create({
        data: {
          content: data.content,
          user: { connect: { id: user.id } },
          chat: { connect: { id: chat.id } }
        }
      });

      const msgDto: ChatMessageDto = {
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
    catch (error) {
      Logger.error(error)
      return Promise.reject("cannot post message")
    }
  }


};
