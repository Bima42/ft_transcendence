import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SchoolAuthGuard } from './guards/42-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(SchoolAuthGuard)
  @Get('42')
  async auth42(@Req() req) {
    // redirect the user to the OAuth provider's authorization page
    console.log('here');
    return req.redirect('https://api.intra.42.fr/oauth/authorize');
  }

  @UseGuards(SchoolAuthGuard)
  @Get('42/callback')
  async auth42Callback(@Req() req) {
    // handle the callback from the OAuth provider
    // check if the user was successfully authenticated
    if (!req.user) {
      throw new HttpException(
        'Failed to authenticate user',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // if the user is authenticated, redirect them to the index
    return req.redirect('/index');
  }
}
