import type IUser from '@/interfaces/user/IUser';
import type { GameStatus, GameType } from './IGame'

export default interface IGameSettings {
  type: GameType
	status: GameStatus
	players: IUser[]
}
