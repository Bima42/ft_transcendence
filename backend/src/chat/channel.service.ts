import {
	BadRequestException,
	NotFoundException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	Logger,
	InternalServerErrorException,
} from '@nestjs/common';
import { UserChatRole } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';
import { UserChat, Chat, ChatMessage, User } from '@prisma/client';
import { ChatMessageDto, NewChatMessageDto, NewWhisperMessageDto } from './dto/message.dto';
import { DetailedChannelDto, JoinChannelDto, NewChannelDto, NewWhisperDto } from './dto/channel.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { toUserDto } from 'src/shared/mapper/user.mapper';
import { toMessageDto } from 'src/shared/mapper/message.mapper';

@Injectable()
export class ChannelService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UsersService,
	) {
	}

	async getSubscribedChannels(user: User): Promise<Array<NewChannelDto>> {
		let channels: Chat[] = [];
		channels = await this.prismaService.chat.findMany({
			where: {
				type: { not: 'WHISPER' },
				users: {
					some: {
						userId: { equals: user.id },
					},
				},
				NOT: {
					users: {
						some: {
							userId: { equals: user.id },
							role: { equals: 'BANNED' },
						},
					},
				},
			},
		});
		if (!channels) {
			throw new BadRequestException('No channel found');
		}
		return channels;
	}

	async getPublicChannels(user: User): Promise<Array<NewChannelDto>> {
		let channels: Chat[] = [];
		channels = await this.prismaService.chat.findMany({
			where: {
				type: { equals: 'PUBLIC' },
				NOT: {
					users: {
						some: {
							userId: { equals: user.id },
							role: { equals: 'BANNED' },
						},
					},
				},
			},
		});
		if (!channels) {
			throw new BadRequestException('No channel found');
		}
		return channels;
	}

	async getWhisperChannels(user: User): Promise<Array<DetailedChannelDto>> {
		let channels: Chat[] = [];
		channels = await this.prismaService.chat.findMany({
			where: {
				type: { equals: 'WHISPER' },
				users: {
					some: {
						userId: { equals: user.id },
					},
				},
			},
		});
		if (!channels) {
			throw new BadRequestException('No channel found');
		}

		let details = []
		for (const el of channels) {
			const detail = await this.getChannelDetails(user, el.id)

			// Change chat name to other person name
			const otherUser = detail.users?.find((userChat) => userChat.user.id != user?.id)
			if (otherUser)
				detail.name = otherUser.user.username;

			details.push(detail)
		}
		return details

	}

	// Return the detailed description of the chat, except for the messages
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
				orderBy: { id: 'asc' },
			});
		}

		if (!channels) {
			throw new BadRequestException('No channel found');
		}

		if (channels.length == 0) {
			const general: NewChannelDto = {
				name: 'General',
				type: 'PUBLIC',
			}
			// Create the default chat
			Logger.log('Generate the general chat');
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
	async getChannelDetails(user: User, chatId: number): Promise<DetailedChannelDto> {

		const chat: Chat = await this.prismaService.chat.findUnique({
			where: { id: +chatId },
		});

		// TODO TYR: When the chat is not found
		if (!chat)
			throw new NotFoundException("Chat not found")

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
				{ role: 'asc', },
				{ userId: 'desc', },
			],
		})

		// Check that the user has access to the detailed chat
		const found = (users as UserChat[]).find((el: UserChat) => (el.userId == user.id && el.role != 'BANNED'));
		if (!found && !(chat.type == 'PUBLIC' && !chat.password)) {
			throw new ForbiddenException('Not allowed to access this channel')
		}

		const usersChatDto = users.map((el) => {
			return {
				userId: el.userId,
				chatId: el.chatId,
				role: el.role,
				mutedUntil: el.mutedUntil,
				user: toUserDto(el.user)
			}
		})
		const chatDto: DetailedChannelDto = {
			id: chatId,
			name: chat.name,
			createdAt: chat.createdAt,
			updatedAt: chat.updatedAt,
			users: usersChatDto,
		}
		return chatDto;
	}

	async findChannelById(chatId: number): Promise<Chat> {
		const chat = await this.prismaService.chat.findUnique({
			where: { id: +chatId }
		});
		if (!chat) {
			throw new NotFoundException('Chat not found')
		}
		return chat
	}

	async findByName(chatName: string): Promise<Chat> {
		const chat = await this.prismaService.chat.findFirst({
			where: { name: chatName }
		});
		if (!chat) {
			throw new NotFoundException('Chat not found')
		}
		return chat
	}

	async createChannel(user: User, newChannel: NewChannelDto): Promise<DetailedChannelDto> {
		try {
			const existingChannel = await this.findByName(newChannel.name);
			if (existingChannel) {
				return this.getChannelDetails(user, existingChannel.id);
			}
		} catch (e) {
		}

		if (newChannel.password) {
			const saltRounds = 10;
			newChannel.password = await bcrypt.hash(newChannel.password, saltRounds);
		}

		const newChat = await this.prismaService.chat.create({
			data: newChannel
		});

		// Create owner role for user
		await this.prismaService.userChat.create({
			data: {
				role: 'OWNER',
				chatId: newChat.id,
				userId: user.id,
			}
		});
		Logger.log(`${user.username}#${user.id} created a new chat ${newChat.type} : ${newChat.name}#${newChat.id}`);
		return this.getChannelDetails(user, newChat.id);
	}

	async createWhisperChat(user1: User, targetUsername: string): Promise<Chat> {
		const targetUser = await this.userService.findByName(targetUsername);

		// Find if already exists:
		const existing = await this.prismaService.chat.findFirst({
			where: {
				type: 'WHISPER',
				users: {
					every: { id: { in: [user1.id, targetUser.id] } }
				}
			},
		})
		if (existing) {
			Logger.log(`${user1.username}#${user1.id} wanted to create an existing whisper with ${targetUser.username}#${targetUser.id}`);
			return existing
		}
		const chat = await this.prismaService.chat.create({
			data: {
				type: "WHISPER",
				name: "whisper",
				users: {
					create: [
						{
							userId: user1.id,
							role: 'MEMBER'
						},
						{
							userId: targetUser.id,
							role: 'MEMBER'
						},
					],
				},
			},
		})
		Logger.log(`${user1.username}#${user1.id} created a new whisper with ${targetUser.username}#${targetUser.id}`);
		return chat
	}

	async updateChannel(user: User, chatId: number, newChannel: NewChannelDto) {
		// Get the current role of the request user
		const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
		if (!reqUserChat || reqUserChat.role != 'OWNER') {
			throw new ForbiddenException('Not authorized to update Channel');
		}

		// TODO: can we remove the channel password ?
		if (newChannel.password) {
			const saltRounds = 10;
			newChannel.password = await bcrypt.hash(newChannel.password, saltRounds);
		}

		await this.prismaService.chat.update({
			where: { id: chatId },
			data: newChannel
		});
		return this.getChannelDetails(user, chatId)
	}

	async deleteChannel(user: User, chatId: number) {

		// Get the current role of the request user
		const reqUserChat = await this.findUserchatFromIds(chatId, user.id);
		if (!reqUserChat || reqUserChat.role != 'OWNER') {
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

		Logger.log('Deleted chat ' + chatId + ': '
			+ roleOutput.count + ' roles and ' + MsgOutput.count + ' messages erased');

	}

	async joinChannel(user: User, newData: JoinChannelDto): Promise<DetailedChannelDto> {
		const chat: Chat = await this.findChannelById(newData.chatId);


		// Cannot join private chat, must be added by an admin
		if (chat.type != 'PUBLIC')
			throw new ForbiddenException('Channel is private');

		// check password
		if (chat.password &&
			(!newData.password || !await bcrypt.compare(newData.password, chat.password))) {
			throw new ForbiddenException('Invalid password');
		}

		// add userRole
		await this.prismaService.userChat.create({
			data: {
				role: 'MEMBER',
				chatId: newData.chatId,
				userId: user.id,
			}
		});

		return this.getChannelDetails(user, newData.chatId);
	}

	async leaveChannel(user: User, data: JoinChannelDto) {

		Logger.log(`${user.username}#${user.id} wants to leave channel ${data.chatId}`);
		// Get the current role of the request user
		const reqUserChat = await this.findUserchatFromIds(data.chatId, user.id);
		if (!reqUserChat || reqUserChat.role == 'BANNED') {
			throw new ForbiddenException('Not authorized to leave Channel');
		}

		// Check if the user is the OWNER before passing the role to another user
		if (reqUserChat.role === 'OWNER') {
			// Pass the OWNER role to the next user
			await this.passOwnerRole(data.chatId, user.id);
		}

		// delete userRole
		await this.prismaService.userChat.delete({
			where: { id: reqUserChat.id }
		});

		this.deleteChatIfEmpty(data.chatId);
	}

	async getLastMessages(chatId: number, nbrMsgs: number): Promise<ChatMessageDto[]> {
		const chat = await this.findChannelById(chatId);
		if (!chat)
			return [];
		const msgs = await this.prismaService.chatMessage.findMany({
			skip: 0,
			take: nbrMsgs,
			where: { chatId: chatId },
			orderBy: { id: 'desc' },
			include: {
				user: true
			},
		});
		return msgs.map((msg) => toMessageDto(msg, msg.user))
	}

	async postMessageInWhisperChat(user: User, data: NewWhisperMessageDto): Promise<ChatMessageDto> {
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
				throw new BadRequestException("Cannot find chat")
			}
			const msg: ChatMessage = await this.prismaService.chatMessage.create({
				data: {
					content: data.content,
					user: { connect: { id: user.id } },
					chat: { connect: { id: chat.id } }
				}
			});
			return toMessageDto(msg, user);
		}
		catch (error) {
			Logger.error(error)
			return Promise.reject("cannot post message")
		}
	}

	async postMessage(user: UserDto, chatId: number, data: NewChatMessageDto): Promise<ChatMessageDto> {
		const chat = await this.findChannelById(chatId);
		if (!chat) {
			return Promise.reject('No chat');
		}

		// Check if user is allowed to post a message:
		let chatRole = await this.findUserchatFromIds(chatId, user.id);
		if (!chatRole) {
			if (chat.type == 'PUBLIC' && !chat.password) {
				// Add the user to public chat
				chatRole = await this.prismaService.userChat.create({
					data: {
						chatId: chat.id,
						userId: user.id,
					}
				})
			} else {
				// Not a member of a private chat
				Logger.log('User is a stranger from chat');
				return Promise.reject('stranger');
			}
		}

		// Banned from chat
		if (chatRole.role == 'BANNED')
			return Promise.reject('banned');
		// Muted
		if (chatRole.mutedUntil && (chatRole.mutedUntil as Date).getTime() > Date.now()) {
			return Promise.reject('muted');
		}

		const msg: ChatMessage = await this.prismaService.chatMessage.create({
			data: {
				content: data.content,
				user: { connect: { id: user.id } },
				chat: { connect: { id: chatId } }
			}
		});

		return toMessageDto(msg, user);
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
		if (targetUserChat.role == 'OWNER') {
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
			const mutedUntil = this.updateMutedUntil(null, muteDuration * 60); //Dirty was here
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
			Logger.log('Cannot change role from owner');
			throw new ForbiddenException('Owner is untouchable');
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

	updateMutedUntil(currentMutedUntil: Date | null, muteDuration: number): Date | null {
		if (muteDuration) {
			const newMutedUntil = new Date();
			newMutedUntil.setSeconds(newMutedUntil.getSeconds() + muteDuration * 60);
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

	async findUserchatFromIds(chatIdd: number, userIdd: number): Promise<UserChat | null> {
		const userchat = await this.prismaService.userChat.findFirst({
			where: {
				chatId: chatIdd,
				userId: userIdd,
			},
		});
		return userchat;
	}

	async deleteChatIfEmpty(chatId: number): Promise<void> {

		const chat = await this.prismaService.chat.findUnique({
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

	async changeChatName(user: UserDto, chatId: number, newName: string): Promise<void> {
		const userChat = await this.prismaService.userChat.findFirst({
			where: {
				userId: user.id
			}
		})
		if (!userChat || userChat.role != 'OWNER')
			throw new ForbiddenException("Not allow to change chat name");

		if (!newName) {
			throw new BadRequestException('New name cannot be empty');
		}
		await this.prismaService.chat.update({
			where: { id: chatId },
			data: { name: newName },
		});
	}

	async isPasswordProtected(chatId: number): Promise<boolean> {
		const chat = await this.prismaService.chat.findUnique({
			where: { id: chatId },
		});
		if (!chat) {
			throw new NotFoundException(`Chat not found`);
		}
		return chat.password != null;
	}
}
