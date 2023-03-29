import { IsEnum } from 'class-validator'
import { User, Game, GameType } from '@prisma/client'

export class JoinQueueDto {
  @IsEnum(GameType)
  type: GameType
}

export type GameSettingsDto = {
    game: Game
    player1: User,
    player2: User,
}
