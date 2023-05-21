import { IsEnum } from 'class-validator'
import { Game, GameType } from '@prisma/client'
import { UserDto } from 'src/users/dto/user.dto'

export class JoinQueueDto {
	@IsEnum(GameType)
	type: GameType
}

export type GameSettingsDto = {
	game: Game
	player1: UserDto,
	player2: UserDto,
}
