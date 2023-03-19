import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
		if (!token) {
			res.status(401).send('Unauthorized');
		}
		try {
			const verifiedToken = this.authService.verifyToken(token);
			const user = await this.usersService.findById(verifiedToken.sub);
			if (user) {
				user.status = UserStatus.ONLINE;
				req.user = user;
				console.log('User is online', req.user);
			}
			else {
				res.status(401).send('Unauthorized, user not found');
			}
			next();
		} catch (e) {
			res.status(401).send('Unauthorized, token is invalid');
		}
	}
}
