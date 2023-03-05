import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response } from 'express';
import { AuthService } from '../../auth/auth.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService
	) {}

	async use(req: Request, res: Response, next: () => void) {
		const token = req.cookies['token'];
		if (!token) {
			res.status(401).send('Unauthorized');
		}
		try {
			const verifiedToken = this.authService.verifyToken(token);
			const user = await this.usersService.findById(verifiedToken.sub);
			if (user) {
				user.status = UserStatus.ONLINE;
				req.user = user;
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