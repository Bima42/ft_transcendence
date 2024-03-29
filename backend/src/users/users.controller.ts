import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { toUserDto } from 'src/shared/mapper/user.mapper';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';


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

  @Post('signup')
  async signup(@Body() newUser: CreateUserDto) : Promise<UserDto> {
    return toUserDto(await this.usersService.create(newUser, false))
  }

  @Get('all')
  async getAllUsers(): Promise<UserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<UserDto> {
    return await this.usersService.findByName(username);
  }

  @Get('id/:id')
  async getUser( @Param('id', ParseIntPipe) userId: number) : Promise<UserDto> {
    return toUserDto(await this.usersService.findById(userId));
  }

  /**
   * ParseIntPipe : protection to ensures that a method handler parameter is converted to a JavaScript integer
   * (or throws an exception if the conversion fails).
   *
   * @param req: RequestWithUser
   * @param data: User
   */
  @Patch('me')
  async updateUser(
      @Req() req: RequestWithUser,
      @Body() data: UpdateUserDto
  ): Promise<UserDto> {
      return this.usersService.updateData(req.user.id, data);
  }

  @Delete('me')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
      return this.usersService.delete(userId);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', storage))
  async updateAvatar(
      @Req() req: RequestWithUser,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({ fileType: 'jpeg|png|jpg' })
          .addMaxSizeValidator({ maxSize: 1000000 })
          .build()
      )  file: Express.Multer.File
  ) {
      const avatarUrl = `${process.env.FRONTEND_URL}/api/${file.path}`
      return this.usersService.updateData(req.user.id, {avatar:avatarUrl});
  }
}
