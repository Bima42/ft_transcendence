import { defineStore } from 'pinia';
import { get, jsonHeaders, patch, post } from '../../utils';
import type IFriendship from '@/interfaces/user/IFriendship';
import type { FriendshipStatus } from '@/interfaces/user/IFriendship';
import type IFriend from '@/interfaces/user/IFriend';
import type IUser from '@/interfaces/user/IUser';
import { ref } from 'vue';
import type IBlocked from '@/interfaces/user/IBlocked';

export const useFriendStore = defineStore( 'friend', () => {
	const friends = ref<IFriend[]>([]);
	const blocked = ref<IBlocked[]>([]);
	get('friends/all', 'Failed to get all friends', jsonHeaders).then((data) => {
		friends.value = data;
	});
	get('friends/blocked', 'Failed to get all blocked', jsonHeaders).then((data) => {
		blocked.value = data;
	});
	console.log('friends', friends.value);

	const updateStoreDatas = async () => {
		friends.value = await getAllFriends();
		blocked.value = await getAllBlocked();
	}

	const resetState = () => {
		friends.value = [];
		blocked.value = [];
	}

	/*************************************************************************
	 *                                                                       *
	 *                               FRIENDS                                 *
	 *                                                                       *
	 *************************************************************************/

		const addFriend = async(friendName: string): Promise<boolean> => {
			const data: IFriendship = await post(
				`friends/add/${friendName}`,
				'Failed to add friend',
				jsonHeaders,
			)
			if (data.status === 'ACCEPTED') {
				await updateStoreDatas();
			}
			return data.status === 'PENDING' || data.status === 'ACCEPTED';
		}

		const removeFriend = async (friendName: string): Promise<boolean> => {
			await post(
				`friends/remove/${friendName}`,
				'Failed to remove friend',
				jsonHeaders,
			)
			await updateStoreDatas();
			return true;
		}

		const acceptFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await patch(
				`friends/accept/${friendName}`,
				'Failed to accept friend request',
				jsonHeaders,
			)
			await updateStoreDatas();
			return data.status === 'ACCEPTED';
		}

		const declineFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await patch(
				`friends/decline/${friendName}`,
				'Failed to decline friend request',
				jsonHeaders,
			)
			return data.status === 'DECLINED';
		}

		const cancelFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await post(
				`friends/cancel/${friendName}`,
				'Failed to cancel friend request',
				jsonHeaders,
			)
			return data.status === 'CANCELED';
		}

		const getAllFriends = async (): Promise<IFriend[]> => {
			return get(
				'friends/all',
				'Failed to get all friends',
				jsonHeaders,
			)
		}

		const isWaitingRequest = async (friendName: string): Promise<boolean> => {
			return get(
				`friends/isWaiting/${friendName}`,
				'Failed to check if waiting request',
				jsonHeaders,
			)
		}

		const getAllPendingRequests = (): Promise<IUser[]> => {
			return get(
				'friends/pending',
				'Failed to get all pending requests',
				jsonHeaders,
			)
		}

		const isFriend = (id: number): boolean => {
			return friends.value.some((friend) => friend.id === id);
		}

	/*************************************************************************
	 *                                                                       *
	 *                           BLOCKED                                     *
	 *                                                                       *
	 *************************************************************************/

		const blockUser = async (username: string): Promise<boolean> => {
			await post(
				`friends/block/${username}`,
				'Failed to block user',
				jsonHeaders,
			)
			await updateStoreDatas();
			return true;
		}

		const unblockUser = async (username: string): Promise<boolean> => {
			await post(
				`friends/unblock/${username}`,
				'Failed to unblock user',
				jsonHeaders,
			)
			await updateStoreDatas();
			return true;
		}

		const getAllBlocked = async () => {
			return get(
				'friends/blocked',
				'Failed to get all blocked',
				jsonHeaders,
			)
		}

		const isBlocked = (id: number): boolean => {
			return blocked.value.some((blocked) => blocked.id === id);
		}


	const getUserInfos = async (username: string): Promise<IUser> => {
		return get(
			`users/${username}`,
			'Failed to get user infos',
		)
	}

		return {
			friends,
			blocked,
			updateStoreDatas,
			resetState,
			addFriend,
			removeFriend,
			acceptFriendRequest,
			declineFriendRequest,
			cancelFriendRequest,
			getAllFriends,
			isWaitingRequest,
			getAllPendingRequests,
			isFriend,
			blockUser,
			unblockUser,
			getAllBlocked,
			isBlocked,
			getUserInfos
		}
});
