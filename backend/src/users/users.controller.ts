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
import { UsersMiddleware } from './middlewares/users.middleware';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService
  ) {}

  @Get('all')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    const users = await this.usersService.findAll();
    res.status(200).send({ users });
  }

  /**
   * ParseIntPipe : protection to ensures that a method handler parameter is converted to a JavaScript integer
   * (or throws an exception if the conversion fails).
   *
   * @param userId
   */
  @Get('id/:id')
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.findById(userId);
  }

  @Patch('id/:id')
  async updateUser(
        @Param('id', ParseIntPipe) userId: number,
        @Body() data: User
  ): Promise<User> {
      return this.usersService.update(userId, data);
  }

  @Delete('id/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
      return this.usersService.delete(userId);
  }
}
