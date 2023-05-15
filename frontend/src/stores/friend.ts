import { defineStore } from 'pinia';
import { get, jsonHeaders, patch, post } from '../../utils';
import type IFriendship from '@/interfaces/user/IFriendship';
import type IFriend from '@/interfaces/user/IFriend';
import type IUser from '@/interfaces/user/IUser';

export const useFriendStore = defineStore( 'friend', () => {

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
			return await post(
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
				.then(response => response.json())
		}

		const getAllWaitingRequests = () => {
			return get(
				'friends/waiting',
				'Failed to get all waiting requests',
				jsonHeaders,
			)
				.then(response => response.json())
		}

		const isWaitingRequest = (friendName: string): Promise<boolean> => {
			return get(
				`friends/isWaiting/${friendName}`,
				'Failed to check if waiting request',
				jsonHeaders,
			)
				.then(response => response.json())
		}

		const getAllPendingRequests = (): Promise<IUser[]> => {
			return get(
				'friends/pending',
				'Failed to get all pending requests',
				jsonHeaders,
			)
				.then(response => response.json())
		}

		const isFriend = (friendName: string): Promise<boolean> => {
			return get(
				`friends/is/${friendName}`,
				'Failed to check if friend',
				jsonHeaders,
			).then(response => {
				return response.json();
			})
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

		const getAllBlocked = () => {
			return get(
				'friends/blocked',
				'Failed to get all blocked',
				jsonHeaders,
			)
				.then(response => response.json())
		}

		const isBlocked = (username: string): Promise<boolean> => {
			return get(
				`friends/isBlocked/${username}`,
				'Failed to check if blocked',
				jsonHeaders,
			).then(response => response.json())
		}

		const canUnblock = (username: string): Promise<boolean> => {
			return get(
				`friends/can/unblock/${username}`,
				'Failed to check if can unblock',
				jsonHeaders,
			).then(response => response.json())
	}

	const getUserInfos = (username: string): Promise<IUser> => {
		return get(
			`users/${username}`,
			'Failed to get user infos',
		)
			.then(response => response.json())
	}

		return {
			addFriend,
			removeFriend,
			acceptFriendRequest,
			declineFriendRequest,
			cancelFriendRequest,
			getAllFriends,
			getAllWaitingRequests,
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
