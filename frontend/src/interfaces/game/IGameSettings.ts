import type IUser from '@/interfaces/user/IUser';
import type IGame from './IGame';
import type { GameStatus, GameType } from './IGame'


export default interface IGameSettings {
    game: IGame,
    player1: IUser,
    player2: IUser,
}
