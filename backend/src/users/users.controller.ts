import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() data: User): Promise<User> {
    return this.usersService.create(data);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    return this.usersService.findById(userId);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  async updateUser(
        @Param('id') userId: number,
        @Body() data: User
  ): Promise<User> {
      return this.usersService.update(userId, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: number) {
      return this.usersService.delete(userId);
  }
}
