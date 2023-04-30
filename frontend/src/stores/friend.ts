import { defineStore } from 'pinia';
import { get, jsonHeaders, patch, post } from '../../utils';
import type IFriendship from '@/interfaces/user/IFriendship';

export const useFriendStore = defineStore( 'friend', () => {

	/*************************************************************************
	 *                                                                       *
	 *                               FRIENDS                                 *
	 *                                                                       *
	 *************************************************************************/

		const addFriend = async(friendName: string): Promise<boolean> => {
			const response = await post(
				`friends/add/${friendName}`,
				'Failed to add friend',
				jsonHeaders,
			)
			const data = await response.json() as IFriendship;
			return data.status === 'PENDING';
		}

		const removeFriend = async (friendName: string): Promise<boolean> => {
			const response = await post(
				`friends/remove/${friendName}`,
				'Failed to remove friend',
				jsonHeaders,
			)
			return await response.json();
		}

		const acceptFriendRequest = async (friendName: string): Promise<boolean> => {
			const response = await patch(
				`friends/accept/${friendName}`,
				'Failed to accept friend request',
				jsonHeaders,
			)
			const data = await response.json() as IFriendship;
			return data.status === 'ACCEPTED';
		}

		const declineFriendRequest = async (friendName: string): Promise<boolean> => {
			const response = await patch(
				`friends/decline/${friendName}`,
				'Failed to decline friend request',
				jsonHeaders,
			)
			const data = await response.json() as IFriendship;
			return data.status === 'DECLINED';
		}

		const getAllFriends = async () => {
			const response = await get(
				'friends/all',
				'Failed to get all friends',
				jsonHeaders,
			)
			return await response.json();
		}

		const getAllWaitingRequests = function() {
			get(
				'friends/waiting',
				'Failed to get all waiting requests',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

		const isWaitingRequest = async (friendName: string): Promise<boolean> => {
			const response = await get(
				`friends/isWaiting/${friendName}`,
				'Failed to check if waiting request',
				jsonHeaders,
			);
			return await response.json();
		}

		const getAllPendingRequests = function() {
			get(
				'friends/pending',
				'Failed to get all pending requests',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

		const isFriend = async (friendName: string): Promise<boolean> => {
			const response = await get(
				`friends/is/${friendName}`,
				'Failed to check if friend',
				jsonHeaders,
			);
			return await response.json();
		}

	/*************************************************************************
	 *                                                                       *
	 *                           BLOCKED                                     *
	 *                                                                       *
	 *************************************************************************/

		const blockUser = async (username: string): Promise<boolean> => {
			const response = await post(
				`friends/block/${username}`,
				'Failed to block user',
				jsonHeaders,
			)
			return await response.json();
		}

		const unblockUser = async (username: string): Promise<boolean> => {
			const response = await post(
				`friends/unblock/${username}`,
				'Failed to unblock user',
				jsonHeaders,
			)
			return await response.json();
		}

		const getAllBlocked = function() {
			get(
				'friends/blocked',
				'Failed to get all blocked',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

		const getAllBlockers = function() {
			get(
				'friends/blockers',
				'Failed to get all blockers',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

		const isBlocked = async (username: string): Promise<boolean> => {
			const response = await get(
				`friends/isBlocked/${username}`,
				'Failed to check if blocked',
				jsonHeaders,
			)
			return await response.json();
		}

		const canUnblock = async (username: string): Promise<boolean> => {
			const response = await get(
				`friends/can/unblock/${username}`,
				'Failed to check if can unblock',
				jsonHeaders,
			)
			return await response.json();
	}

		return {
			addFriend,
			removeFriend,
			acceptFriendRequest,
			declineFriendRequest,
			getAllFriends,
			getAllWaitingRequests,
			isWaitingRequest,
			getAllPendingRequests,
			isFriend,
			blockUser,
			unblockUser,
			getAllBlocked,
			getAllBlockers,
			isBlocked,
			canUnblock,
		}
});