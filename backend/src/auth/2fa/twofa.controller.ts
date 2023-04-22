import { Body, Controller, Param, ParseIntPipe, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';
import { Response } from 'express';
import { TwoFaService } from './twofa.service';
import { UserDto } from '../../users/dto/user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('2fa')
@ApiBearerAuth('JWT')
export class TwoFaController {
	constructor(
		private readonly authService: AuthService,
		private readonly twoFaService: TwoFaService
	) {}

	@Patch(':id')
	async updateUserTwoFa(
		@Param('id', ParseIntPipe) userId: number,
		@Body() datas: any
	): Promise<UserDto> {
		return this.twoFaService.updateTwoFaStatus(userId, datas.twoFA);
	}

	@Post('verify')
	async verify2fa(
		@Req() req: RequestWithUser,
		@Res() res: Response,
		@Body() datas: { code: string }
	){
		const user = req.user;
		try {
			this.twoFaService.verifyTwoFactorAuthCode(user, datas.code);

			if (req.cookies[process.env.JWT_COOKIE])
				res.clearCookie(process.env.JWT_COOKIE);

			this.authService.storeTokenInCookie(user, res);

			res.status(200).send({ twoFAAuthenticated: true });
		}
		catch (e) {
			res.status(500).send(e);
		}
	}

	@Post('generate')
	async generate2fa(@Req() req: RequestWithUser, @Res() res: Response) {
		const user = req.user;
		if (user.twoFA) {
			const otpauthUrl = await this.twoFaService.generateTwoFactorAuthSecret(req.user);
			const qrCodeImage = await this.twoFaService.generateQrCode(res, otpauthUrl);
			res.status(200).json({ qrCodeImage: qrCodeImage });
		} else {
			res.status(400).send('2FA already enabled');
		}
	}
}