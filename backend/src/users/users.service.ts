import { BadRequestException, NotFoundException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto, UserDto } from './dto/user.dto';
import { toUserDto } from '../shared/mapper/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

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

  async findByName(username: string): Promise<UserDto> {
      const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserDto(user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany();

    if (!users) {
      throw new BadRequestException('No users found');
    }

    return users.map(user => toUserDto(user));
  }

  async updateData(userId: number, data: UpdateUserDto): Promise<UserDto> {

    // Username must be unique
    let otherUser: UserDto | null = null
    if (data.username) {
      try {
        otherUser = await this.findByName(data.username)
      } catch (_e) {}
    }
    if (otherUser && otherUser.id != userId)
      throw new BadRequestException("Username is already taken");


    try {
      const targetUser = await this.prismaService.user.update({
        where: {
          id: +userId
        },
        data: data
      });
      return toUserDto(targetUser);
    } catch (error) {
      throw new BadRequestException("Cannot update user")
    }
  }

  async setTwoFaSecret(userId: number, secret: string): Promise<UserDto> {
    try {
      return this.prismaService.user.update({
        where: {
          id: +userId
        },
        data: {
          twoFASecret: secret
        }
      });
    } catch (error) {
      throw new InternalServerErrorException("Cannot set 2FA secret")

    }
  }

  async delete(userId: number): Promise<UserDto> {
    try {
      return this.prismaService.user.delete({
        where: {
          id: +userId
        }
      });
    } catch (error) {
      throw new InternalServerErrorException("Cannot delete you");
    }
  }
}
