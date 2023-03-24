import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import {Response} from 'express';
import {User} from '@prisma/client';
import {authenticator} from 'otplib';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {
	}

	async findOrCreate({username, email, firstName, lastName, phone, fortyTwoId, avatar}: {
		username: string,
		email: string,
		firstName: string,
		lastName: string,
		phone: string,
		fortyTwoId: number,
		avatar: string
	}): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			return this.prismaService.user.create({
				data: {
					username,
					email,
					firstName,
					lastName,
					phone,
					fortyTwoId,
					avatar
				}
			});
		}
		//TODO : check this update, some things can be wrong
		else {
			return this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					firstName,
					lastName,
					fortyTwoId
				}
			});
		}
	}

	async generateTwoFactorAuthSecret(user: User) {
		const secret = authenticator.generateSecret();
		const otpAuthUrl = authenticator.keyuri(user.email, 'Transcendence', secret);

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				twoFASecret: secret
			}
		});

		return {
			secret,
			otpAuthUrl
		}
	}

	_createToken(user: any) {
		const payload = {sub: parseInt(user.id), email: user.email};
		return {
			access_token: this.jwtService.sign(
				payload,
				{
					secret: process.env.JWT_KEY,
					expiresIn: '1d'
				}),
		}
	}

	verifyToken(token: string) {
		if (!token) {
			return new BadRequestException('No token provided');
		}
		return this.jwtService.verify(
			token, {
				secret: process.env.JWT_KEY
			});
	}

	async logout(res: Response, userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: +userId
			}
		});

		if (!user) {
			throw new BadRequestException('User not found');
		}

		res.cookie(process.env.JWT_COOKIE, '', {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 0,
		});

		return res.status(200).send('Sign out success');
	}
}
