import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    return this.usersService.findById(userId);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() data: User): Promise<User> {
        return this.usersService.create(data);
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
