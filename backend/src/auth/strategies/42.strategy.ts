import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolStrategy extends Strategy {
  constructor() {
    super(
      {
        clientID: process.env.FORTYTWO_API_UID,
        clientSecret: process.env.FORTYTWO_API_SECRET,
        callbackURL: process.env.AUTH_CALLBACK,
        // Allow us to get the profile of the user, we can add email for example to get his mail
        scope: ['profile'],
      },
      async (accessToken, refreshToken, profile, done) => {
        // TODO : add protection, may be search the user inside the DB and add if not, to stores his data
        // try {
        //   const user = await this.usersService.findOne(profile.id);
        //   if (!user) {
        //     return done(null, false);
        //   }
        // store the access token and refresh token in the user's session
        // user.accessToken = accessToken;
        // user.refreshToken = refreshToken;
        // return done(null, user);
        // } catch (err) {
        //   return done(err);
        // }
        return done(null, profile);
      },
    );
  }
}
