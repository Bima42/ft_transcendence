import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: process.env.JWT_KEY,
		});
	}

	/**
	 * This function is called by NestJS when a user attempts to access a route that requires authentication.
	 * If the token is valid, validate() returns a user object, which is then stored in the request object.
	 * If the token is not valid, validate() throws an error, which is handled by NestJS and results in a 401 Unauthorized response to the user.
	 */
	async validate(payload: any) {
		return await this.usersService.findById(payload.sub);
	}
}
