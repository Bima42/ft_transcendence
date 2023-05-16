import { defineStore } from 'pinia';
import { get, jsonHeaders, patch, post } from '../../utils';
import type IFriendship from '@/interfaces/user/IFriendship';
import type IFriend from '@/interfaces/user/IFriend';
import type IUser from '@/interfaces/user/IUser';
import { ref } from 'vue';
import type IBlocked from '@/interfaces/user/IBlocked';

export const useFriendStore = defineStore( 'friend', () => {
	const friends = ref<IFriend[]>([]);
	const blocked = ref<IBlocked[]>([]);

	const updateStoreDatas = async () => {
		friends.value = await getAllFriends();
		blocked.value = await getAllBlocked();
	}

	const resetStoreDatas = () => {
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
			return data.status === 'PENDING';
		}

		const removeFriend = async (friendName: string): Promise<boolean> => {
			return post(
				`friends/remove/${friendName}`,
				'Failed to remove friend',
				jsonHeaders,
			)
		}

		const acceptFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await patch(
				`friends/accept/${friendName}`,
				'Failed to accept friend request',
				jsonHeaders,
			)
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

		const isFriend = async (friendName: string): Promise<boolean> => {
			return get(
				`friends/is/${friendName}`,
				'Failed to check if friend',
				jsonHeaders,
			)
		}

	/*************************************************************************
	 *                                                                       *
	 *                           BLOCKED                                     *
	 *                                                                       *
	 *************************************************************************/

		const blockUser = (username: string): Promise<boolean> => {
			return post(
				`friends/block/${username}`,
				'Failed to block user',
				jsonHeaders,
			)
				.then(response => response.json())
		}

		const unblockUser = (username: string): Promise<boolean> => {
			return post(
				`friends/unblock/${username}`,
				'Failed to unblock user',
				jsonHeaders,
			)
				.then(response => response.json())
		}

		const getAllBlocked = async () => {
			return get(
				'friends/blocked',
				'Failed to get all blocked',
				jsonHeaders,
			)
		}

		const isBlocked = async (username: string): Promise<boolean> => {
			return get(
				`friends/isBlocked/${username}`,
				'Failed to check if blocked',
				jsonHeaders,
			)
		}

		const canUnblock = async (username: string): Promise<boolean> => {
			return get(
				`friends/can/unblock/${username}`,
				'Failed to check if can unblock',
				jsonHeaders,
			)
	}

	const getUserInfos = async (username: string): Promise<IUser> => {
		return get(
			`users/${username}`,
			'Failed to get user infos',
		)
	}

		return {
			updateStoreDatas,
			resetStoreDatas,
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
			canUnblock,
			getUserInfos
		}
});
