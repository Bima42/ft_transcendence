import type IUser from '@/interfaces/user/IUser';

export default interface IGame {
	id: number
	type: GameType
	status: GameStatus
	createdAt: Date
	endedAt: Date
	users: IUser[]
}

export type GameStatus = 'SEARCHING' | 'STARTED' | 'ENDED'
export type GameType = 'CLASSIC' | 'CUSTOM'
