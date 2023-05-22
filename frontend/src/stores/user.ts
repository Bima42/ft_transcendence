import {get, jsonHeaders, mediaHeaders, patch, post} from '../../utils'
import {defineStore} from 'pinia'
import type IUser from '../interfaces/user/IUser'
import {getCookie} from 'typescript-cookie'
import {ref} from 'vue'
import type IUserUpdate from '../interfaces/user/IUserUpdate'
import type IUserStats from '@/interfaces/user/IUserStats'
import type IMatchHistory from '@/interfaces/user/IMatchHistory'
import type {UserStatus} from '@/interfaces/user/IUser'
import {useAlertStore} from '@/stores/alert'


export const useUserStore = defineStore('user', () => {
	const user = ref<IUser | null>(localStorage.getItem('localUser') ? JSON.parse(localStorage.getItem('localUser')!) as IUser : null)
	const stats = ref<IUserStats | null>()
	const alertStore = useAlertStore()

	const resetState = () => {
		user.value = null
		stats.value = null
		localStorage.removeItem('localUser');
	}

	const setState = (newUser: IUser) => {
		user.value = newUser
		localStorage.setItem('localUser', JSON.stringify(user.value))
	}

	const login = () => {
		return get(
			'auth/login',
			'Failed to login',
		).then(json => {
			setState(json as IUser)
			return true
		}).catch(err => {
			alertStore.setErrorAlert(err)
			return false
		})
	}

	const logout = (): boolean => {
		get(`auth/logout`, 'Failed to logout').then()
		resetState()
		return true
	}

	const isLoggedIn = (): boolean => {
		const token = getCookie(import.meta.env.VITE_JWT_COOKIE);
		return user.value != null && token != null;
	}

	const updateTwoFaStatus = (status: boolean) => {
		if (!user.value)
			return

		patch(
			`2fa`,
			'Failed to update 2FA status',
			jsonHeaders,
			{twoFA: status}
		)
			.then((newUser: IUser) => {
				user.value = newUser
				localStorage.setItem('localUser', JSON.stringify(user.value))
			}).catch(err => {
			alertStore.setErrorAlert(err)
		})
	}

	const verifyTwoFaCode = async (code: string): Promise<boolean> => {
		const json = await post(
			'2fa/verify',
			'Failed to verify 2fa code',
			jsonHeaders,
			{code: code}
		)
		if (json.twoFAAuthenticated) {
			await login();
		}
		return json.twoFAAuthenticated
	}

	const updateInfos = (infos: IUserUpdate): Promise<IUser | null> => {
		// Yes, we have to use await and then, not sure why
		return patch(`users/me`, 'cannot update username', jsonHeaders, infos)
			.then((newUser: IUser) => {
				setState(newUser)
				return user.value
			}).catch(err => {
				alertStore.setErrorAlert(err)
				return null
			})
	}

	const uploadAvatar = (file: FormData) => {
		post(
			`users/avatar`,
			'Failed to upload avatar',
			mediaHeaders,
			undefined,
			file
		)
			.then(json => {
				const datas = json as IUser
				const avatar = datas.avatar
				updateAvatar(avatar)
			})
			.catch(error => {
				alertStore.setErrorAlert(error)
			})
	}

	const updateAvatar = (avatar: string) => {
		// This cache key is used to force the browser to reload the image without changing the url
		const cacheKey = new Date().getTime()

		user.value!.avatar = `${avatar}?${cacheKey}`
		localStorage.setItem('localUser', JSON.stringify(user.value))
	}

	const updateStatus = (status: UserStatus | undefined): Promise<UserStatus> => {
		switch (status) {
			case 'ONLINE':
				user.value!.status = 'OFFLINE'
				break
			case 'OFFLINE':
				user.value!.status = 'AWAY'
				break
			case 'AWAY':
				user.value!.status = 'BUSY'
				break
			case 'BUSY':
				user.value!.status = 'ONLINE'
				break
			default:
				break
		}

		return patch(
			`users/me`,
			'Failed to update status',
			jsonHeaders,
			{status: user.value!.status}
		).then((newUser: IUser) => {
			setState(newUser)
			return newUser.status
		}).catch(err => {
			alertStore.setErrorAlert('Failed to update status')
			return user.value!.status
		})
	}

	const getUserStats = async (user_id: number | undefined = user.value?.id): Promise<IUserStats> => {
		return get(
			`users/stats/${user_id}`,
			'Failed to get user stats',
			jsonHeaders,
		)
	}

	const getLeaderboard = async (): Promise<IUserStats[]> => {
		const users: IUserStats[] = await get(
			'users/stats/leaderboard',
			'Failed to get leaderboard datas',
			jsonHeaders,
		)
		users.forEach((el) => {
			delete el.wonGames
		})
		return users
	}

	const getEloHistory = async (user_id: number | undefined = user.value?.id) => {
		return get(
			`users/stats/elo/history/${user_id}`,
			'Failed to get elo history',
			jsonHeaders,
		)
	}

	const getHighestElo = async () => {
		return get(
			`users/stats/elo/highest`,
			'Failed to get highest elo',
			jsonHeaders,
		)
	}

	const getMatchHistory = async (user_id: number | undefined = user.value?.id): Promise<IMatchHistory[]> => {
		return get(
			`users/stats/matchHistory/${user_id}`,
			'Failed to get match history',
			jsonHeaders,
		)
	}

	const getRank = (user_id: number | undefined = user.value?.id): Promise<number> => {
		if (!user_id)
			return Promise.reject('No user id provided')
		return get(
			`users/stats/rank/${user_id}`,
			'Failed to get rank',
			jsonHeaders,
		).then((rank: number) => {
			return rank
		}).catch()
	}

	const getUserInfos = async (user_id: number | string | undefined = user.value?.id): Promise<IUser> => {
		return get(
			`users/id/${user_id}`,
			'Failed to get user infos',
			jsonHeaders,
		)
	}

	const getUserInfosByUsername = async (username: string): Promise<IUser> => {
		return get(
			`users/${username}`,
			'Failed to get user infos',
			jsonHeaders,
		)
	}

	return {
		user,
		resetState,
		setState,
		login,
		logout,
		isLoggedIn,
		updateTwoFaStatus,
		verifyTwoFaCode,
		updateInfos,
		uploadAvatar,
		updateAvatar,
		updateStatus,
		getUserStats,
		getLeaderboard,
		getEloHistory,
		getHighestElo,
		getMatchHistory,
		getRank,
		getUserInfos,
		getUserInfosByUsername
	}
});
