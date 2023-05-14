import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { UserDto } from '../../users/dto/user.dto';
import { toUserDto } from '../../shared/mapper/user.mapper';

@Injectable()
export class TwoFaService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService
	) {}

	async updateTwoFaStatus(user: User, enableTwoFA: boolean): Promise<UserDto> {
		if (user.twoFA !== enableTwoFA) {
			user = await this.prismaService.user.update({
				where: {
					id: +user.id
				},
				data: {
					twoFA: { set: enableTwoFA }
				}
			});
		}

		return toUserDto(user);
	}

	verifyTwoFactorAuthCode(user: User, code: string) {
		const verified = speakeasy.totp.verify({
			secret: user.twoFASecret,
			encoding: 'base32',
			token: code
		});
		if (!verified) {
			throw new UnauthorizedException('Invalid 2FA code');
		}
		return true;
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
