import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService
	) {}

	async use(req: RequestWithUser, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization
		const token = authHeader && authHeader.split(' ')[1]
		if (!token) {
			res.status(401).send('Middleware: Unauthorized !');
			return;
		}
		try {
			const verifiedToken = this.authService.verifyToken(token);
			const user = await this.usersService.findById(verifiedToken.sub);
			if (!user) {
				res.clearCookie(process.env.JWT_COOKIE);
				res.status(401).send('Unauthorized, user not found');
				return;
			}
			req.user = user;
			next();
		} catch (e) {
			res.clearCookie(process.env.JWT_COOKIE);
			res.status(401).send('Unauthorized, token is invalid');
		}
	}
}
