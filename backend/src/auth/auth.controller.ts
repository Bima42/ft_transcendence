import {Controller, ForbiddenException, Get, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import axios from 'axios';
import {UserStatus} from "@prisma/client";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService
  ) {
  }

  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginFortyTwo(@Res() res: Response) {
  }

  @Get('login/42/callback')
  async loginFortyTwoCallback(@Req() req: Request, @Res() res: Response) {
    const { code } = req.query;

    try {
      const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.FORTYTWO_API_UID,
        client_secret: process.env.FORTYTWO_API_SECRET,
        code: code,
        redirect_uri: process.env.FORTYTWO_API_CALLBACK,
      });

      const userData = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`
        },
      });

      const { id, email, login, image } = userData.data;
      const user = await this.authService.createOrValidateUser({
        id,
        username: login,
        email,
        fortyTwoId: id,
        avatar: image.versions.little,
      });

      if (user) {
        await this.usersService.updateStatus(user.id, UserStatus.ONLINE);
      }

      if (!req.cookies) {
        const token = this.authService._createToken(user);

        if (!token) {
          throw new ForbiddenException('Empty token');
        }

        res.cookie('token', token.access_token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          secure: true,
          sameSite: 'none',
        });
      }

      const redirectUrl = `${process.env.FRONTEND_URL}/index`;
      res.status(302).redirect(redirectUrl);
    }

    catch (e) {
      console.error(e);
      res.status(500).send('Authentication via 42 API failed');
    }
  }
}
