import {Controller, ForbiddenException, Get, Param, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import axios from 'axios';
import { UserStatus } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService
  ) {
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginFortyTwo(@Res() res: Response) {
  }

  /**
   * Callback for 42 API authentication
   * Full Documentation here : https://api.intra.42.fr/apidoc/guides/web_application_flow
   * @param req
   * @param res
   */
  @Get('42/callback')
  async loginFortyTwoCallback(@Req() req: Request, @Res() res: Response) {
    // Query to /oauth/authorize made by frontend with the custom url
    // We get here after user has accepted to share his data with our app

    // Get code from query params
    const { code } = req.query;

    try {
      // POST request to /oauth/token to get access_token, must be on server side
      const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.FORTYTWO_API_UID,
        client_secret: process.env.FORTYTWO_API_SECRET,
        code: code,
        redirect_uri: process.env.FORTYTWO_API_CALLBACK,
      });

      // We can use the token to make requests to the API
      // GET request to /v2/me to get user data
      const userData = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`
        },
      });

      // Create or validate user with data from 42 API
      const { id, email, login, image } = userData.data;
      const user = await this.authService.findOrCreate({
        username: login,
        email,
        fortyTwoId: id,
        avatar: image.versions.little,
      });

      if (user) {
        await this.usersService.updateStatus(user.id, UserStatus.ONLINE);
      }

      // Create token and set cookie
      if (!req.cookies) {
        const token = this.authService._createToken(user);

        if (!token) {
          throw new ForbiddenException('Empty token');
        }

        res.cookie('access_token', token.access_token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          secure: true,
          sameSite: 'none',
        });
      }
      const redirectUrl = `${process.env.FRONTEND_URL}/index`
      res.status(302).redirect(redirectUrl);
    }

    catch (e) {
      console.error(e);
      res.status(500).send('Authentication via 42 API failed');
    }
  }

  @Get('signout/:id')
  async logout(
      @Res({ passthrough: true }) res,
      @Param() params: { id: number })
  {
    res.clearCookie('access_token');
    await this.usersService.updateStatus(params.id, UserStatus.OFFLINE);
    return this.authService.logout(res, params.id);
  }
}
