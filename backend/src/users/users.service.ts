import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserChat,UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
      private readonly prismaService: PrismaService
  ) {}

  async create(data: User): Promise<User> {
    const user = await this.prismaService.user.create({
      data: data
    });

    if (!user) {
      throw new BadRequestException('User not created');
    }

    return user;
  }

  async findById(userId: number) {
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

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();

    if (!users) {
      throw new BadRequestException('No users found');
    }

    return users;
  }

  async updateStatus(userId: number, status: UserStatus): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: {
        status: status
      }
    });
  }

  async updateData(userId: number, data: User): Promise<User> {
    return  this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: data
    });
  }

  async updateTwoFaStatus(userId: number, enableTwoFA: boolean): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: +userId
      }
    })

    if (user.twoFA !== enableTwoFA) {
      return this.prismaService.user.update({
        where: {
          id: +userId
        },
        data: {
          twoFA: { set: enableTwoFA }
        }
      });
    }
  }

  async setTwoFaSecret(userId: number, secret: string): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: {
        twoFASecret: secret
      }
    });
  }

  async delete(userId: number): Promise<User> {
     return this.prismaService.user.delete({
       where: {
        id: +userId
       }
     });
  }

  async getAlluserchat(userId): Promise<UserChat[]> {
    return this.prismaService.userChat.findMany({
      where: {
        userId: userId
      },
    });
  }
}
