import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor() {
		super({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: process.env.FORTYTWO_API_UID,
			clientSecret: process.env.FORTYTWO_API_SECRET,
			callbackURL: process.env.FORTYTWO_API_CALLBACK,
			scope: ['public'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, cb) {
		const { id, two_fa, forty_two_id, username, email, avatar, status } = profile;
		const user = {
			id,
			twoFA: two_fa,
			fortyTwoId: forty_two_id,
			username,
			email,
			avatar,
			status
		};

		cb(null, user);
	}
}