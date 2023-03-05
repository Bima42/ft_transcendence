import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService) {}

  @Get('login')
  async login(@Req() req: Request, @Res() res: Response) {
    res.status(200).send('coucou');

    // const user = req.user;
    // if (!user) {
    //   res.status(401).send('Unauthorized');
    // } else {
    //   res.status(200).send(user);
    // }
  }
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
