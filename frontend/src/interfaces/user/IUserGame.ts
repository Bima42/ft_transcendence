import type IUser from '@/interfaces/user/IUser';
import type IGame from '@/interfaces/game/IGame';

export default interface IUserGame {
	id: number
	game: IGame
	user: IUser
}