import { get, post } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'

export default defineStore({
	id: 'auth',
	state: () => ({
		user: localStorage.getItem("localUser") ? JSON.parse(localStorage.getItem("localUser") as string) : undefined,
	}),
	getters: {
		logged: (state) => state.user !== null,
		username: (state) => state.user?.username,
	},
	actions: {
		login() {
			get(
				'users/login',
				'Failed to login',
			)
				.then(response => response.json())
				.then(json => {
					this.user = json as IUser
					localStorage.setItem("localUser", JSON.stringify(this.user));
					window.location.href = 'http://localhost:8000/index'
				})
		},
		logout() {
			if (!this.user)
				return
			get(`auth/logout/${this.user.id}`, 'Failed to logout').then(() => {
				this.user = null
				localStorage.removeItem("localUser");
				window.location.href = window.location.href
			})
		}
	}
})