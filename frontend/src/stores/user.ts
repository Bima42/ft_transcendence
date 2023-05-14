import { get, jsonHeaders, mediaHeaders, patch, post } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'
import { getCookie } from 'typescript-cookie'
import { ref } from 'vue'
import type IUserUpdate from '../interfaces/user/IUserUpdate'
import type IUserStats from '@/interfaces/user/IUserStats';
import type IMatchHistory from '@/interfaces/user/IMatchHistory';

export const useUserStore = defineStore('user', () => {
	const user = ref<IUser | null>(localStorage.getItem('localUser') ? JSON.parse(localStorage.getItem('localUser')!) as IUser : null)

	const resetState = function () {
		user.value = null
		localStorage.removeItem('localUser');
	}

	const redirect = function () {
		let redirect = 'https://api.intra.42.fr/oauth/authorize?client_id='
		redirect += import.meta.env.VITE_FORTYTWO_API_UID + '&redirect_uri=';
		redirect += encodeURIComponent(import.meta.env.VITE_FORTYTWO_API_CALLBACK) + '&response_type=code';
		window.open(redirect, '_self')
	}
	const login = function () {
		return get(
			'auth/login',
			'Failed to login',
		)
			.then(response => response.json())
			.then(json => {
				user.value = json as IUser
				localStorage.setItem('localUser', JSON.stringify(user.value))
				return true
			})
			.catch(err => {
				alert(err)
				return false
			})
	}

	const logout = function () : boolean {
		resetState()
		get(`auth/logout/${user.value.id}`, 'Failed to logout')
		.catch(e => console.log(e.message))
		return true
	}

	const isLoggedIn = function (): boolean {
		const token = getCookie(import.meta.env.VITE_JWT_COOKIE);
		return user.value != null && token != null;
	}

	const updateTwoFaStatus = async function (status: boolean) {
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
		})
	}

	const verifyTwoFaCode = async function (code: string): Promise<boolean> {
		const json = await post(
			'2fa/verify',
			'Failed to verify 2fa code',
			jsonHeaders,
			{code: code}
		)
		if (json.twoFAAuthenticated) {
			login();
		}
		return json.twoFAAuthenticated
	}

  const updateInfos = async function (infos: IUserUpdate) : Promise<IUser | null> {
	// Yes, we have to use await and then, not sure why
    await patch(`users/me`, "cannot update username", jsonHeaders, infos)
    .then((newUser: IUser) => {
      user.value = newUser
      localStorage.setItem('localUser', JSON.stringify(user.value))
    })

    return user.value
  }

	const uploadAvatar = function (file: FormData) {
		post(
			`users/avatar`,
			'Failed to upload avatar',
			mediaHeaders,
			undefined,
			file
		)
			.then(response => response.json())
			.then(json => {
				const datas = json as IUser
				const avatar = datas.avatar
				updateAvatar(avatar)
			})
			.catch(error => {
				console.log(error)
			})
	}

	const updateAvatar = function (avatar: string) {
		// This cache key is used to force the browser to reload the image without changing the url
		const cacheKey = new Date().getTime()

		user.value!.avatar = `${avatar}?${cacheKey}`
		localStorage.setItem('localUser', JSON.stringify(user.value))
	}

	const getUserStats = async (user_id: number | undefined = user.value?.id): Promise<IUserStats> => {
		const stats = await get(
			`users/stats/${user_id}`,
			'Failed to get user stats',
			jsonHeaders,
		)
		return stats.json()
	}

	const getLeaderboard = async (): Promise<IUserStats[]> => {
		const users: IUserStats[] = await get(
			'users/stats/leaderboard',
			'Failed to get leaderboard datas',
			jsonHeaders,
		).then(res => res.json())
		.catch(() => [])
		users.forEach((el) => { delete el.wonGames})
		return users
	}

	const getEloHistory = async (user_id: number | undefined = user.value?.id) => {
		const response = await get(
			`users/stats/elo/history/${user_id}`,
			'Failed to get elo history',
			jsonHeaders,
		)
		return response.json()
	}

	const getHighestElo = async () => {
		const response = await get(
			`users/stats/elo/highest`,
			'Failed to get highest elo',
			jsonHeaders,
		)
		return response.json()
	}

	const getMatchHistory = async (user_id: number | undefined = user.value?.id): Promise<IMatchHistory[]> => {
		const response = await get(
			`users/stats/matchHistory/${user_id}`,
			'Failed to get match history',
			jsonHeaders,
		)
		return response.json()
	}

	const getUserInfos = (user_id: number | string | undefined = user.value?.id): Promise<IUser> => {
		return get(
			`users/id/${user_id}`,
			'Failed to get user infos',
			jsonHeaders,
		).then(response => response.json())
	}

	return {
		user,
		resetState,
		redirect,
		login,
		logout,
		isLoggedIn,
		updateTwoFaStatus,
		verifyTwoFaCode,
		updateInfos,
		uploadAvatar,
		updateAvatar,
		getUserStats,
		getLeaderboard,
		getEloHistory,
		getHighestElo,
		getMatchHistory,
		getUserInfos
	}
});
