import { get } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'

export const useAuthStore = defineStore( 'auth', () => {
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
				console.log('json', json)
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
    return user == null;
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
    testEndpoint,
	}
})
