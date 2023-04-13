import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { toUserDto } from '../shared/mapper/user.mapper';

@Injectable()
export class UsersService {
  constructor(
      private readonly prismaService: PrismaService
  ) {}

  async create(data: User): Promise<UserDto> {
    const user = await this.prismaService.user.create({
      data: data
    });

    if (!user) {
      throw new BadRequestException('User not created');
    }

    return user;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: +userId
      }
    });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByName(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      }
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany();

    if (!users) {
      throw new BadRequestException('No users found');
    }

    return users.map(user => toUserDto(user));
  }

  async updateStatus(userId: number, status: UserStatus): Promise<UserDto> {
    const user = await this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: {
        status: status
      }
    });

    return toUserDto(user);
  }

  async updateData(userId: number, data: UserDto): Promise<UserDto> {
    const user = await this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: data
    });

    return toUserDto(user);
  }

  async updateAvatar(userId: number, avatar: string): Promise<UserDto> {
    const avatarUrl = `${process.env.FRONTEND_URL}/api/${avatar}`
    const user = await this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: {
        avatar: avatarUrl
      }
    });

    return toUserDto(user);
  }

  async setTwoFaSecret(userId: number, secret: string): Promise<UserDto> {
    return this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: {
        twoFASecret: secret
      }
    });
  }

  async delete(userId: number): Promise<UserDto> {
     return this.prismaService.user.delete({
       where: {
        id: +userId
       }
     });
  }

  async getPlayedGamesByUserId(userId: number) {
    const playedGames = this.prismaService.userGame.findMany({
      where: {
        userId: userId
      }
    });

    return playedGames.then((games) => games.length);
  }

  async getWinGamesByUserId(userId: number) {
    const winGames = this.prismaService.userGame.findMany({
      where: {
        userId: userId,
        win: 1
      }
    });

    return winGames.then((games) => games.length);
  }
}
