import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';
import { Response } from 'express';
import { TwoFaService } from './twofa.service';

@Controller('2fa')
export class TwoFaController {
	constructor(
		private readonly authService: AuthService,
		private readonly twoFaService: TwoFaService
	) {}

	@Post('verify')
	async verify2fa(
		@Req() req: RequestWithUser,
		@Res() res: Response,
		@Body() datas: { code: string }
	){
		const user = req.user;
		try {
			await this.twoFaService.verifyTwoFactorAuthCode(user, datas.code);

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