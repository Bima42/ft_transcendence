import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { GameService } from './game.service';
import { Request, Response } from 'express'
import { User } from '@prisma/client';

@ApiTags('Game')
@Controller('game')
@ApiBearerAuth('JWT')
export class GameController {
  constructor(
    private gameService: GameService,
  ) {}


  @Get('current')
  getCurrentGame(@Req() req: Request, @Res() res: Response) {
      const gameSettings = this.gameService.getCurrentGame(req.user as User);
      if (!gameSettings)
        return res.status(404).send("Game not Found");
      else
        return res.status(200).json(gameSettings);
  }

}
