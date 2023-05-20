import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
	const message = ref<string | null>(null)
	const show = ref(false)
	const title = ref<string | null>(null)
	const error = ref<boolean>(false)
	const callBack = ref<Function | null>(null)
	const passwordInput = ref<boolean>(false)
	const passwordCallback = ref<Function | null>(null)

	const setErrorAlert = function (newMessage: string) {
		error.value = true
		title.value = 'An error occurred'
		message.value = newMessage
		show.value = true
	}

	const setValidationAlert = function (newTitle: string, newMessage: string,  newCallBack: () => void) {
		title.value = newTitle
		message.value = newMessage
		callBack.value = newCallBack
		show.value = true
	}

	const setPasswordAlert = function (newTitle: string, newMessage: string,  newPasswordCallback: (pass: string) => boolean) {
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
		passwordInput.value = false
		passwordCallback.value = null
	}

	return {
		message,
		show,
		title,
		error,
		callBack,
		passwordInput,
		passwordCallback,
		setErrorAlert,
		setValidationAlert,
		setPasswordAlert,
		resetState,
	}
})