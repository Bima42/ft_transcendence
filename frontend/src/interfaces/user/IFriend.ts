import type { UserStatus } from '@/interfaces/user/IUser';

export default interface IFriend {
			id: number;
			username: string;
			firstName?: string;
			lastName?: string;
			avatar: string;
			status: UserStatus;
}