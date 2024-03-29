import { defineStore } from 'pinia'
import { ref } from 'vue'
import type IChat from '@/interfaces/chat/IChat';

export const useAlertStore = defineStore('alert', () => {
	const message = ref<string | null>(null)
	const show = ref(false)
	const title = ref<string | null>(null)
	const error = ref<boolean>(false)
	const callBack = ref<Function | null>(null)
	const callBackRefuse = ref<Function | null>(null)
	const passwordInput = ref<boolean>(false)
	const passwordCallback = ref<Function | null>(null)

	const setErrorAlert = function (newMessage: string, newCallBack?: () => void) {
		error.value = true
		title.value = 'An error occurred'
		message.value = newMessage
		if (newCallBack)
			callBack.value = newCallBack
		show.value = true
	}

	const setValidationAlert = function (newTitle: string, newMessage: string,  newAcceptCallBack?: () => void, newRefuseCallBack?: () => void) {
		title.value = newTitle
		message.value = newMessage
		if (newAcceptCallBack)
			callBack.value = newAcceptCallBack
		if (newRefuseCallBack)
			callBackRefuse.value = newRefuseCallBack
		show.value = true
	}

	const setPasswordAlert = function (newTitle: string, newMessage: string,  newPasswordCallback: (pass: string) => Promise<boolean>) {
		passwordInput.value = true
		title.value = newTitle
		message.value = newMessage
		passwordCallback.value = newPasswordCallback
		show.value = true
	}
	const resetState = function () {
		message.value = null
		show.value = false
		title.value = null
		error.value = false
		callBack.value = null
		callBackRefuse.value = null
		passwordInput.value = false
		passwordCallback.value = null
	}

	return {
		message,
		show,
		title,
		error,
		callBack,
		callBackRefuse,
		passwordInput,
		passwordCallback,
		setErrorAlert,
		setValidationAlert,
		setPasswordAlert,
		resetState,
	}
})
