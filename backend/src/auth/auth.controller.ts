import {
  Body,
  Req,
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { FortyTwoAuthGuard } from './guards/42.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * register route handler that receives an instance of CreateUserDto object and delegates creating a new user to the AuthService
   * @param createUserDto
   */
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  /**
   * login route handler : returns the response of the call to AuthService.login() function
   * @param loginUserDto
   * @param res
   */
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const loginStatus: LoginStatus = await this.authService.login(loginUserDto);

    if (loginStatus.status === 'success') {
      res.cookie('access_token', loginStatus.accessToken);
      res.redirect('http://localhost:8080/index');
    } else {
      throw new HttpException('Connection failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  async login42(@Req() req, @Res() res: Response) {
    res.cookie('access_token', req.user.accessToken);
    res.redirect('http://localhost:8080/index');
  }
}
