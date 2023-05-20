<template>
	<div class="notification_box slide-in-right slide-in-top">
		<XButton :size="'medium'" class="exit-button" @click="notificationStore.removeNotification(props.notification)"/>
		<div v-if="props.notification.picture" class="icon">
			<img :src="props.notification.picture" alt="icon" />
		</div>
		<p>
			<span v-if="props.notification.title">
				{{ props.notification.title }} :
			</span>
			{{ props.notification.message }}
		</p>
	</div>
</template>

<script setup lang="ts">
import type INotification from '@/interfaces/INotification';
import { useNotificationStore } from '@/stores/notification';
import XButton from '@/components/buttons/XButton.vue';

const props = defineProps<{
	notification: INotification
}>()
const notificationStore = useNotificationStore()
</script>

<style scoped lang="scss">
.notification_box {
	display: flex;
	border: 1px solid $tertiary;
	border-radius: 5px;
	background: $secondary;

	button {
		width: 22px;
		height: 22px;
		margin: 7px;
		align-self: center;
		text-align: center;
		border-radius: 50%;
		background: $tertiary;
		border: none;
		cursor: pointer;
		font-weight: bold;
		font-family: 'Martian Mono', monospace;
		color: white;
	}

	p {
		margin: 5px;
		align-self: center;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (orientation: landscape) {
		width: 100%;
		height: 100px;
		-webkit-animation: slide-in-right 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
		animation: slide-in-right 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

		p {
			-webkit-line-clamp: 4;
		}

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 50px;
			height: 50px;
			border-radius: 50%;
			align-self: center;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
	@media (orientation: portrait) {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;

		p {
			-webkit-line-clamp: 2;
		}

		.icon {
			display: none;
		}
	}
}

@media (orientation: landscape) {
	.slide-in-right {
		-webkit-animation: slide-in-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
		animation: slide-in-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	}
	@-webkit-keyframes slide-in-right {
		0% {
			-webkit-transform: translateX(1000px);
			transform: translateX(1000px);
			opacity: 0;
		}
		100% {
			-webkit-transform: translateX(0);
			transform: translateX(0);
			opacity: 1;
		}
	}
	@keyframes slide-in-right {
		0% {
			-webkit-transform: translateX(1000px);
			transform: translateX(1000px);
			opacity: 0;
		}
		100% {
			-webkit-transform: translateX(0);
			transform: translateX(0);
			opacity: 1;
		}
	}
}

@media (orientation: portrait) {
	.slide-in-top {
		-webkit-animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
		animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	}

	@-webkit-keyframes slide-in-top {
		0% {
			-webkit-transform: translateY(-1000px);
			transform: translateY(-1000px);
			opacity: 0;
		}
		100% {
			-webkit-transform: translateY(0);
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes slide-in-top {
		0% {
			-webkit-transform: translateY(-1000px);
			transform: translateY(-1000px);
			opacity: 0;
		}
		100% {
			-webkit-transform: translateY(0);
			transform: translateY(0);
			opacity: 1;
		}
	}

}
</style>