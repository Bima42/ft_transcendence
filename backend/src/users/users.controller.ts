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
  ParseIntPipe,
  UseInterceptors, UploadedFile, ParseFilePipeBuilder
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService
  ) {}

  @Get('all')
  async getAllUsers(@Req() req: RequestWithUser, @Res() res: Response) {
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

  @Patch('twofa/:id')
  async updateUserTwoFa(
      @Param('id', ParseIntPipe) userId: number,
      @Body() datas: any
  ) {
    return this.usersService.updateTwoFaStatus(userId, datas.twoFA);
  }

  @Patch('id/:id')
  async updateUser(
        @Param('id', ParseIntPipe) userId: number,
        @Body() data: User
  ): Promise<User> {
      return this.usersService.updateData(userId, data);
  }

  @Delete('id/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
      return this.usersService.delete(userId);
  }

  @Post('avatar/:id')
  @UseInterceptors(FileInterceptor('avatar', { dest: './uploads' }))
  async updateAvatar(
      @Param('id', ParseIntPipe) userId: number,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({ fileType: 'jpeg|png|jpg' })
          .addMaxSizeValidator({ maxSize: 10000000 })
          .build()
      )  file: Express.Multer.File
  ) {
      console.log(file);
      return this.usersService.updateAvatar(userId, file.path);
  }
}
