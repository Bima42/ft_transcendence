import { defineStore } from 'pinia';
import { get, jsonHeaders, patch, post } from '../../utils';
import type IFriendship from '@/interfaces/user/IFriendship';
import type IFriend from '@/interfaces/user/IFriend';
import type IUser from '@/interfaces/user/IUser';
import { ref } from 'vue';
import type IBlocked from '@/interfaces/user/IBlocked';
import { useUserStore } from '@/stores/user';

export const useFriendStore = defineStore( 'friend', () => {
	const friends = ref<IFriend[]>([]);
	const blocked = ref<IBlocked[]>([]);
	const sentRequests = ref<IFriendship[]>([]);
	const receivedRequests = ref<IFriendship[]>([]);
	get('friends/all', 'Failed to get all friends', jsonHeaders).then((data) => {
		friends.value = data;
	});
	get('friends/blocked', 'Failed to get all blocked', jsonHeaders).then((data) => {
		blocked.value = data;
	});
	get('friends/waiting', 'Failed to get all sent requests', jsonHeaders).then((data) => {
		sentRequests.value = data;
	});
	get('friends/pending', 'Failed to get all pending requests', jsonHeaders).then((data) => {
		receivedRequests.value = data;
	});

	const updateStoreDatas = async () => {
		friends.value = await getAllFriends();
		blocked.value = await getAllBlocked();
		sentRequests.value = await getAllWaitingRequests();
		receivedRequests.value = await getAllPendingRequests();
	}

	const resetState = () => {
		friends.value = [];
		blocked.value = [];
		sentRequests.value = [];
		receivedRequests.value = [];
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
				const userStore = useUserStore();
				const user = await userStore.getUserInfos(data.userId)
				receivedRequests.value.splice(receivedRequests.value.findIndex((friendship) => friendship.userId === user.id), 1);

				friends.value.push(user);
				return data.status === 'ACCEPTED';
			}
			console.log(data)
			sentRequests.value.push(data);
			return data.status === 'PENDING';
		}

		const removeFriend = async (friendName: string): Promise<boolean> => {
			await post(
				`friends/remove/${friendName}`,
				'Failed to remove friend',
				jsonHeaders,
			)
			friends.value.splice(friends.value.findIndex((friend) => friend.username === friendName), 1);
			return true;
		}

		const acceptFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await patch(
				`friends/accept/${friendName}`,
				'Failed to accept friend request',
				jsonHeaders,
			)
			if (data.status === 'ACCEPTED') {
				// The current user is the friend of the friendship
				receivedRequests.value.splice(receivedRequests.value.findIndex((friendship) => friendship.userId === data.userId), 1);
				const userStore = useUserStore();
				friends.value.push(await userStore.getUserInfos(data.userId));
			}
			return data.status === 'ACCEPTED';
		}

		const declineFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await patch(
				`friends/decline/${friendName}`,
				'Failed to decline friend request',
				jsonHeaders,
			)
			receivedRequests.value.splice(receivedRequests.value.findIndex((friendship) => friendship.userId === data.userId), 1);
			return data.status === 'DECLINED';
		}

		const cancelFriendRequest = async (friendName: string): Promise<boolean> => {
			const data: IFriendship = await post(
				`friends/cancel/${friendName}`,
				'Failed to cancel friend request',
				jsonHeaders,
			)
			sentRequests.value.splice(sentRequests.value.findIndex((friendship) => friendship.friendId === data.friendId), 1);
			return data.status === 'CANCELED';
		}

		const getAllFriends = async (): Promise<IFriend[]> => {
			return get(
				'friends/all',
				'Failed to get all friends',
				jsonHeaders,
			)
		}

		const isRequestSent = (friendId: number): boolean => {
			return sentRequests.value.some((friend) => friend.friendId === friendId);
		}

		const getAllWaitingRequests = (): Promise<IFriendship[]> => {
			return get(
				'friends/waiting',
				'Failed to get all sent requests',
				jsonHeaders,
			)
		}

		const getAllPendingRequests = (): Promise<IFriendship[]> => {
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
			sentRequests,
			receivedRequests,
			updateStoreDatas,
			resetState,
			addFriend,
			removeFriend,
			acceptFriendRequest,
			declineFriendRequest,
			cancelFriendRequest,
			getAllFriends,
			getAllWaitingRequests,
			getAllPendingRequests,
			isFriend,
			isRequestSent,
			blockUser,
			unblockUser,
			getAllBlocked,
			isBlocked,
			getUserInfos
		}
});
