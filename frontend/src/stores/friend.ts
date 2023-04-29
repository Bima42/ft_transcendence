import { defineStore } from 'pinia';
import { get, jsonHeaders, patch, post } from '../../utils';
import type IFriendship from '@/interfaces/user/IFriendship';

export const useFriendStore = defineStore( 'friend', () => {

	/*************************************************************************
	 *                                                                       *
	 *                               FRIENDS                                 *
	 *                                                                       *
	 *************************************************************************/

		const addFriend = function(friendName: string) {
			post(
				`friends/add/${friendName}`,
				'Failed to add friend',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					const friendship = json as IFriendship
					return friendship.status === 'ACCEPTED';
				})
		}

		const removeFriend = function(friendName: string) {
			post(
				`friends/remove/${friendName}`,
				'Failed to remove friend',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					console.log(json);
				})
		}

		const acceptFriendRequest = function(friendName: string) {
			patch(
				`friends/accept/${friendName}`,
				'Failed to accept friend request',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					console.log(json);
				});
		}

		const declineFriendRequest = function(friendName: string) {
			patch(
				`friends/decline/${friendName}`,
				'Failed to decline friend request',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					console.log(json);
				});
		}

		const getAllFriends = function() {
			get(
				'friends/all',
				'Failed to get all friends',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
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

		const isFriend = function(friendName: string) {
			get(
				`friends/is/${friendName}`,
				'Failed to check if friend',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

	/*************************************************************************
	 *                                                                       *
	 *                           BLOCKED                                     *
	 *                                                                       *
	 *************************************************************************/

		const blockUser = function(friendName: string) {
			post(
				`friends/block/${friendName}`,
				'Failed to block user',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

		const unblockUser = function(friendName: string) {
			post(
				`friends/unblock/${friendName}`,
				'Failed to unblock user',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
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

		const isBlocked = function(friendName: string) {
			get(
				`friends/isBlocked/${friendName}`,
				'Failed to check if blocked',
				jsonHeaders,
			)
				.then(response => response.json())
				.then(json => {
					return json;
				});
		}

		return {
			addFriend,
			removeFriend,
			acceptFriendRequest,
			declineFriendRequest,
			getAllFriends,
			getAllWaitingRequests,
			getAllPendingRequests,
			isFriend,
			blockUser,
			unblockUser,
			getAllBlocked,
			getAllBlockers,
			isBlocked
		}
});