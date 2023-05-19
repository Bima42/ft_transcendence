import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
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
			throw new UnauthorizedException("No token")
		}
		try {
			const verifiedToken = this.authService.verifyToken(token);
			req.user = await this.usersService.findById(verifiedToken.sub);
			next();
		} catch (e) {
			res.clearCookie(process.env.JWT_COOKIE);
			res.clearCookie('choco');
			throw new UnauthorizedException('Token is invalid');
		}
	}
}
