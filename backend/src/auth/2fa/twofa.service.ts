import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFaService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService
	) {}

	async verifyTwoFactorAuthCode(user: User, code: string) {
		const verified = speakeasy.totp.verify({
			secret: user.twoFASecret,
			encoding: 'base32',
			token: code
		});
		if (!verified) {
			throw new BadRequestException('Invalid code');
		}
		return this.prismaService.user.update({
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
}