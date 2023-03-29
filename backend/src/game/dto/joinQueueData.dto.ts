import { User, GameType } from '@prisma/client'

export type GameSettingsDto =  {
    type: GameType,
    player1: User,
    player2: User,
}
