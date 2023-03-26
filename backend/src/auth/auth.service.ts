import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService
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

	async verifyTwoFactorAuthCode(user: User, code: string) {
		const verified = speakeasy.totp.verify({
			secret: user.twoFASecret,
			encoding: 'base32',
			token: code
		});
		if (!verified) {
			throw new BadRequestException('Invalid code');
		}
		this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				twoFAAuthenticated: true
			},
		});
	}

	async generateTwoFactorAuthSecret(user: User) {
		const secret = speakeasy.generateSecret();
		const otpauthUrl = speakeasy.otpauthURL({
			secret: secret.base32,
			encoding: 'base32',
			label: 'Transcendence',
			issuer: 'Transcendence',
		});

		await this.usersService.setTwoFaSecret(user.id, secret.base32);

		return otpauthUrl;
	}

	async generateQrCode(res: Response, otpauthUrl: string) {
		return QRCode.toDataURL(otpauthUrl);
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

	async logout(res: Response) {
		res.clearCookie(process.env.JWT_COOKIE);
		return res.status(200).send('Sign out success');
	}
}
