import {BadRequestException, Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
      private readonly prismaService: PrismaService
  ) {}

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

  async create(data: User): Promise<User> {
    const user = await this.prismaService.user.create({
      data: data
    });

    if (!user) {
      throw new BadRequestException('User not created');
    }

    return user;
  }

  async update(userId: number, data: User): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: +userId
      },
      data: data
    });

    if (!updatedUser) {
      throw new BadRequestException('User not updated');
    }

    return updatedUser;
  }

  async delete(userId: number): Promise<User> {
     const deletedUser = await this.prismaService.user.delete({
       where: {
        id: +userId
       }
     });

     if (!deletedUser) {
       throw new BadRequestException('User not deleted');
     }

     return deletedUser;
  }

}
