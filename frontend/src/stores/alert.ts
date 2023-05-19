import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
	const message = ref<string | null>(null)
	const show = ref(false)
	const type = ref<string | null>(null)
	const title = ref<string | null>(null)
	const confirm = ref<string | null>(null)
	const error = ref<boolean>(false)

	const resetState = function () {
		message.value = null
		show.value = false
		type.value = null
		title.value = null
		confirm.value = null
	}

	return {
		message,
		show,
		type,
		title,
		confirm,
		error,
		resetState,
	}
})