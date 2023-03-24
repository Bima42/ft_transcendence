import { get, patch } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'

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
    return user != null;
  }

	const updateTwoFaStatus = function (status: boolean) {
		if (!user)
			return
		user.twoFA = status
		patch(`users/id/twofa/${user.id}`, 'Failed to update user', { twoFA: user.twoFA })
			.then(response => response.json())
			.then(json => {})
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
    testEndpoint,
	}
})
