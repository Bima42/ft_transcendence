import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { UserStatus } from '@prisma/client';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { randomUUID } from 'crypto'

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService
  ) {}

  /**
   * Callback for 42 API authentication
   * Full Documentation here : https://api.intra.42.fr/apidoc/guides/web_application_flow
   * @param req
   * @param res
   */
  @Get('42/callback')
  async loginFortyTwoCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const userData = await this.authService.getUserDatasFrom42Api(req);

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

      // Create token and set cookie
      if (!req.cookies[process.env.JWT_COOKIE]) {
        this.authService.storeTokenInCookie(user, res);
      }

      let redirectUrl = '';
      if (!user.twoFA || user.twoFAAuthenticated)
        redirectUrl = `${process.env.FRONTEND_URL}/redirectHandler`
      else
        redirectUrl = `${process.env.FRONTEND_URL}/2fa`;
      res.status(302).redirect(redirectUrl);
    }

    catch (e) {
      res.status(500).send(e);
    }
  }

  @Get('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user;

    await this.usersService.updateStatus(user.id, UserStatus.ONLINE);
    res.status(200).send(user);
  }

  @Get('logout/:id')
  async logout(
    @Res({ passthrough: true }) res,
    @Param() params: { id: number }
  ) {
    await this.usersService.updateStatus(params.id, UserStatus.OFFLINE);
    await this.authService.logout(res);
    res.status(302).redirect(`${process.env.FRONTEND_URL}/`);
  }

  @Get('bob')
  async signInAsBob(@Req() req: RequestWithUser, @Res() res: Response) {
    const username = randomUUID()
    // Available only on localhost
    if ( ! process.env.FRONTEND_URL.startsWith("https://localhost")) {
        res.status(403).send("Forbidden");
    }
    let bob: any;
    try {
      bob = await this.usersService.findByName(username);
    }
    catch(e) {
      bob = {
        twoFA: false,
        twoFASecret:  null,
        twoFAAuthenticated: false,
        fortyTwoId: null,
        username: username,
        email: username + "@example.com",
        avatar: `https://api.multiavatar.com/${username}.png`,
        firstName: null,
        lastName: null,
        phone: null,
        status: 'OFFLINE',
      }
      bob = await this.usersService.create(bob);
    }
    // If a real user is using this pseudo, abort
    if (bob.fortyTwoId != null) {
      res.status(403).send("Already a bob42");
    }

    if (!req.cookies[process.env.JWT_COOKIE]) {
      this.authService.storeTokenInCookie(bob, res);
    }
    const redirectUrl = `${process.env.FRONTEND_URL}/redirectHandler`
    res.status(302).redirect(redirectUrl);
  }
}
