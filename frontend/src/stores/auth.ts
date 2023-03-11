import { get } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'

export const useAuthStore = defineStore( 'auth', () => {
	let user = localStorage.getItem('localUser') ? JSON.parse(localStorage.getItem('localUser')!) as IUser : null

	const redirect = function () {
		const redirect = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-92ce1a0afad1a634dcd2140cbf1a6fe599e99cb72bd310a13428b5d8187ad240&redirect_uri=http%3A%2F%2Flocalhost%3A3080%2Fauth%2F42%2Fcallback&response_type=code'
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
				localStorage.setItem('localUser', JSON.stringify(user));
				window.location.href = 'http://localhost:8000/index'
			})
	}

	const logout = function () {
		if (!user)
			return
		get(`auth/logout/${user.id}`, 'Failed to logout').then(() => {
			user = null
			localStorage.removeItem('localUser');
			window.location.href = 'http://localhost:8000/'
		})
	}

	return {
		user,
		redirect,
		login,
		logout
	}
})