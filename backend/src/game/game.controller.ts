import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Response } from 'express'
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@ApiTags('Game')
@Controller('game')
@ApiBearerAuth('JWT')
export class GameController {
	constructor(
		private gameService: GameService,
	) { }


	@Get('current')
	getCurrentGame(@Req() req: RequestWithUser, @Res() res: Response) {
		const gameSettings = this.gameService.getCurrentGame(req.user);
		if (!gameSettings)
			throw new NotFoundException("No current game")
		else
			return res.status(200).json(gameSettings);
	}

}
