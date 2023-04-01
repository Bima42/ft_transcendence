import { get, jsonHeaders, mediaHeaders, patch, post } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'
import { getCookie } from 'typescript-cookie';

export const useUserStore = defineStore( 'auth', () => {
	let user = localStorage.getItem('localUser') ? JSON.parse(localStorage.getItem('localUser')!) as IUser : null

	const redirect = function () {
    let redirect = 'https://api.intra.42.fr/oauth/authorize?client_id='
    redirect += import.meta.env.VITE_FORTYTWO_API_UID + '&redirect_uri=';
    redirect += encodeURIComponent(import.meta.env.VITE_FORTYTWO_API_CALLBACK) + '&response_type=code';
		window.open(redirect, '_self')
	}
	const login = function () {
		get(
			'auth/login',
			'Failed to login',
		)
			.then(response => response.json())
			.then(json => {
				user = json as IUser
				localStorage.setItem('localUser', JSON.stringify(user))
				window.location.href = `https://${import.meta.env.VITE_APP_URL}/index`
			})
	}

	const logout = function () {
		if (!user)
			return
		get(`auth/logout/${user.id}`, 'Failed to logout').then(() => {
			user = null
			localStorage.removeItem('localUser');
			window.location.href = `https://${import.meta.env.VITE_APP_URL}/`
		})
	}

  const isLoggedIn = function () : boolean {
		const token = getCookie(import.meta.env.VITE_JWT_COOKIE);
    return user != null && token != null;
  }

	const updateTwoFaStatus = function (status: boolean) {
		if (!user)
			return

		patch(
			`users/twofa/${user.id}`,
			'Failed to update user',
			jsonHeaders,
			{ twoFA: status }
		)
			.then(response => response.json())
			.then(json => {
				user = json as IUser
				localStorage.setItem('localUser', JSON.stringify(user))
			})
	}

	const verifyTwoFaCode = function (code: string) {
		post(
			'2fa/verify',
			'Failed to verify 2fa code',
			jsonHeaders,
			{ code: code }
		)
			.then(response => response.json())
			.then(json => {
				if (json.twoFAAuthenticated) {
					login();
				}
			})
			.catch(error => console.log(error))
	}

	const uploadAvatar = function (file: FormData) {
		post(
			`users/avatar/${user?.id}`,
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
			.catch(error => console.log(error))
	}

	const updateAvatar = function (avatar: string) {
		user!.avatar = avatar
		localStorage.setItem('localUser', JSON.stringify(user))
	}

	const testEndpoint = function () {
		get(`users/id/${user?.id}`, 'Failed to get user')
			.then(response => response.json())
			.then(json => console.log(json))
	}

	return {
    user,
    redirect,
    login,
    logout,
    isLoggedIn,
		updateTwoFaStatus,
		verifyTwoFaCode,
		uploadAvatar,
		updateAvatar,
    testEndpoint,
	}
})
