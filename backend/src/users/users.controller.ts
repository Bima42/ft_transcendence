import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService
  ) {}

  @Get('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      res.status(401).send('Unauthorized');
    } else {
      res.status(200).send(user);
    }
  }

  @Post('create')
  async createUser(@Body() data: User): Promise<User> {
    return this.usersService.create(data);
  }

  /**
   * ParseIntPipe : protection to ensures that a method handler parameter is converted to a JavaScript integer
   * (or throws an exception if the conversion fails).
   *
   * @param userId
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.findById(userId);
  }

  @Get('all')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
        res.status(401).send('Unauthorized');
    } else {
      const users = await this.usersService.findAll();
      res.status(200).send({ users });
    }
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
