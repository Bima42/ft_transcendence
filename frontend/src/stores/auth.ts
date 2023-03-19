import { get } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'

export const useAuthStore = defineStore( 'auth', () => {
	let user = localStorage.getItem('localUser') ? JSON.parse(localStorage.getItem('localUser')!) as IUser : null

	const redirect = function () {
		const redirect = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-175010164675e1a964dee80d5ce4a1ee18e22ba3fb6b0f7773673c3ff68c71d9&redirect_uri=https%3A%2F%2Flocalhost%3A4443%2Fapi%2Fauth%2F42%2Fcallback&response_type=code'
		window.open(redirect, '_self')
	}
	const login = function () {
		get(
			'users/login',
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

	const testEndpoint = function () {
		get(`users/${user?.id}`, 'Failed to get user')
			.then(response => response.json())
			.then(json => console.log(json))
	}

	return {
		user,
		redirect,
		login,
		logout,
		testEndpoint,
	}
})
