import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_API_UID,
      clientSecret: process.env.FORTYTWO_API_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName } = profile;
    const user = {
      accessToken,
      refreshToken,
      id,
      displayName,
    };
    return user;
  }
}
