import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameSettingsDto } from './dto/joinQueueData.dto';
import { GameService } from './game.service';
import { Request, Response } from 'express'
import { User } from '@prisma/client';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
  ) {}


  @Get('current')
  getCurrentGame(@Req() req: Request, @Res() res: Response) {
      const gameSettings = this.gameService.getCurrentGame(req.user as User);
      if (!gameSettings)
        res.status(404).send("Game not Found");
      else
        res.status(200).json(gameSettings);
  }

}
