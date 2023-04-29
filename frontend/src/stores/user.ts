import { get, jsonHeaders, mediaHeaders, patch, post } from '../../utils'
import { defineStore } from 'pinia'
import type IUser from '../interfaces/user/IUser'
import { getCookie } from 'typescript-cookie'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
	const user = ref(localStorage.getItem('localUser') ? JSON.parse(localStorage.getItem('localUser')!) as IUser : null)

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
				user.value = json as IUser
				localStorage.setItem('localUser', JSON.stringify(user.value))
				window.location.href = `https://${import.meta.env.VITE_APP_URL}/index`
			})
	}

	const logout = function () {
		if (!user.value) {
			window.location.href = `https://${import.meta.env.VITE_APP_URL}/`
			return
		}
		get(`auth/logout/${user.value.id}`, 'Failed to logout').then(() => {
			user.value = null
			localStorage.removeItem('localUser');
			window.location.href = `https://${import.meta.env.VITE_APP_URL}/`
		})
	}

	const isLoggedIn = function (): boolean {
		const token = getCookie(import.meta.env.VITE_JWT_COOKIE);
		return user.value != null && token != null;
	}

	const updateTwoFaStatus = function (status: boolean) {
		if (!user.value)
			return

		patch(
			`2fa/${user.value.id}`,
			'Failed to update user',
			jsonHeaders,
			{twoFA: status}
		)
			.then(response => response.json())
			.then(json => {
				user.value = json as IUser
				localStorage.setItem('localUser', JSON.stringify(user.value))
			})
	}

	const verifyTwoFaCode = function (code: string) {
		post(
			'2fa/verify',
			'Failed to verify 2fa code',
			jsonHeaders,
			{code: code}
		)
			.then(response => response.json())
			.then(json => {
				if (json.twoFAAuthenticated) {
					login();
				}
			})
			.catch(error => console.log(error))
	}

	const uploadAvatar = function (file: FormData, loading: Ref) {
		loading.value = true
		post(
			`users/avatar/${user.value?.id}`,
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
				loading.value = false
			})
			.catch(error => {
				console.log(error)
				loading.value = false
			})
	}

	const updateAvatar = function (avatar: string) {
		// This cache key is used to force the browser to reload the image without changing the url
		const cacheKey = new Date().getTime()

		user.value!.avatar = `${avatar}?${cacheKey}`
		localStorage.setItem('localUser', JSON.stringify(user.value))
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
	}
});