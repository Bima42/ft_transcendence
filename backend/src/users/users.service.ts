import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { OnlineUserDto } from './dto/create-user.dto';

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
        throw new BadRequestException('User not found');
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

  async update(userId: number, data: User): Promise<User> {
    return  this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: data
    });
  }

  async delete(userId: number): Promise<User> {
     return this.prismaService.user.delete({
       where: {
        id: +userId
       }
     });
  }
}
