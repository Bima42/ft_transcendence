<template>
	<section class="notification_wrapper">
		<NotificationBox v-for="(notification, index) in notificationStore.notifications" :key="index" :notification="notification" />
	</section>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';
import NotificationBox from '@/components/NotificationBox.vue';

const notificationStore = useNotificationStore()
</script>

<style scoped lang="scss">
.notification_wrapper {
	display: flex;
	z-index: 1000;

	@media (orientation: landscape) {
		min-width: 250px;
		max-width: 300px;
		bottom: 0;
		right: 0;
		position: fixed;
		flex-direction: column-reverse;
		padding-right: $small_gap;
		padding-bottom: $small_gap;
		gap: $small_gap;
	}
	@media (orientation: portrait) {
		display: unset;
		position: fixed;
		height: 50px;
		top: 0;
		left: 5px;
		right: 5px;
		flex-direction: column;
		overflow: hidden;
	}
}
</style>