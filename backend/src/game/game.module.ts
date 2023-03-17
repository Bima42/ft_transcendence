import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  imports: [],
  providers: [PrismaService, GameService, GameGateway],
  controllers: [GameController],
  exports: [GameService],
})

export class GameModule {}
