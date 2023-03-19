import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response, Request } from 'express';
import { UserStatus } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService
  ) {
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
      const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.FORTYTWO_API_UID,
          client_secret: process.env.FORTYTWO_API_SECRET,
          code: code,
          redirect_uri: process.env.FORTYTWO_API_CALLBACK,
        }),
      });
      const tokenData = await tokenResponse.json();

      // We can use the token to make requests to the API
      // GET request to /v2/me to get user data
      const userDataResponse = await fetch('https://api.intra.42.fr/v2/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      const userData = await userDataResponse.json();

      // Create or validate user with data from 42 API
      const { id, email, first_name, last_name, phone, login, image } = userData;
      const user = await this.authService.findOrCreate({
        username: login,
        email,
        firstName: first_name,
        lastName: last_name,
        phone: phone,
        fortyTwoId: id,
        avatar: image.versions.medium,
      });

      // Update user status
      if (user) {
        await this.usersService.updateStatus(user.id, UserStatus.ONLINE);
      }

      // Create token and set cookie
      if (!req.cookies[process.env.JWT_COOKIE]) {
        const token = this.authService._createToken(user);

        if (!token) {
          throw new ForbiddenException('Empty token');
        }

        res.cookie(process.env.JWT_COOKIE, token.access_token, {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          secure: true,
          sameSite: 'none',
        });
      }

      // Redirect to frontend redirectHandler
      const redirectUrl = `${process.env.FRONTEND_URL}/redirectHandler`
      res.status(302).redirect(redirectUrl);
    }

    catch (e) {
      console.error(e);
      res.status(500).send('Authentication via 42 API failed');
    }
  }

  @Get('logout/:id')
  async logout(
      @Res({ passthrough: true }) res,
      @Param() params: { id: number })
  {
    res.clearCookie(process.env.JWT_COOKIE);
    await this.usersService.updateStatus(params.id, UserStatus.OFFLINE);
    await this.authService.logout(res, params.id);
  }
}
