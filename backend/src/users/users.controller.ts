import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors, UploadedFile, ParseFilePipeBuilder
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserDto } from './dto/user.dto';
import { toUserDto } from 'src/shared/mapper/user.mapper';

const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: RequestWithUser, file, cb) => {
      const newFilename = `${req.user.firstName.toLowerCase()}_${req.user.fortyTwoId}`;
      const extension = path.parse(file.originalname).ext;

      cb(null, `${newFilename}${extension}`);
    }
  })
}

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(
      private readonly usersService: UsersService
  ) {}

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<UserDto> {
    return await this.usersService.findByName(username);
  }

  @Get('all')
  async getAllUsers(): Promise<UserDto[]> {
    return await this.usersService.findAll();
  }

  @Get('id/:id')
  async getUser( @Param('id', ParseIntPipe) userId: number) : Promise<UserDto> {
    return toUserDto(await this.usersService.findById(userId));
  }

  /**
   * ParseIntPipe : protection to ensures that a method handler parameter is converted to a JavaScript integer
   * (or throws an exception if the conversion fails).
   *
   * @param userId
   * @param data: User
   */
  @Patch('id/:id')
  async updateUser(
        @Param('id', ParseIntPipe) userId: number,
        @Body() data: User
  ): Promise<UserDto> {
      return this.usersService.updateData(userId, data);
  }

  @Delete('id/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
      return this.usersService.delete(userId);
  }

  @Post('avatar/:id')
  @UseInterceptors(FileInterceptor('avatar', storage))
  async updateAvatar(
      @Param('id', ParseIntPipe) userId: number,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({ fileType: 'jpeg|png|jpg' })
          .addMaxSizeValidator({ maxSize: 1000000 })
          .build()
      )  file: Express.Multer.File
  ) {
      return this.usersService.updateAvatar(userId, file.path);
  }

}
