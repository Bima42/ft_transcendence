import { get, post } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'

const initial = await get('auth', 'Failed to get user data')
	.then(response => response.json())
	.then(json => json as IUser)
	.catch(() => null)

export default defineStore({
	id: 'auth',
	state: () => ({
		user: initial as IUser | null,
	}),
	getters: {
		logged: (state) => state.user !== null,
		username: (state) => state.user?.username,
	},
	actions: {
		register(username: string, password: string) {
			post(
				'auth/register',
				'Failed to register',
				{username: username, password: password}
			)
				.then(response => response.json())
				.then(json => {
					this.user = json as IUser
				})
		},
		login(username: string, password: string) {
			post(
				'auth/login',
				'Failed to login',
				{username: username, password: password}
			)
				.then(response => response.json())
				.then(json => {
					this.user = json as IUser
					window.location.href = window.location.href
				})
		},
		logout() {
			if (!this.user)
				return
			post('auth/logout', 'Failed to logout').then(() => {
				this.user = null
				window.location.href = window.location.href
			})
		}
	}
})