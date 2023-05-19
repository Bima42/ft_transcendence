import { defineStore } from 'pinia';
import { ref } from 'vue';
import type INotification from '@/interfaces/INotification';

export const useNotificationStore = defineStore('notification', () => {
	const show = ref(false);
	const notifications = ref<INotification[]>([]);

	const resetState = function () {
		show.value = false;
		notifications.value = [];
	}

	const addNotification = function (notification: INotification) {
		notifications.value.push(notification);
		setTimeout(() => {
			removeNotification(notification)
		}, notification.lifespan);
	}

	const removeNotification = function (notification: INotification) {
		notifications.value.splice(notifications.value.indexOf(notification), 1);
	}

	return {
		show,
		notifications,
		resetState,
		addNotification,
		removeNotification,
	}
});