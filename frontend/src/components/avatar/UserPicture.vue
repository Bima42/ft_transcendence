<template>
	<div class="user_picture">
		<label for="file_input" class="upload_button" :class="props.type">
			<img :src="url" alt="User picture">
		</label>
		<input v-if="props.isSelf" id="file_input" type="file" @change="handleImageChange" accept="image/*"
			style="display:none">
		<div @click="updateStatus"
			:class="['picture_dot', props.pictureDotSize, statusClass]"/>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref, onUpdated } from 'vue'
import { useUserStore } from '@/stores/user';
import type { UserStatus } from '@/interfaces/user/IUser';

/**
 * @typedef {Object} Props
 * @property {string} existing type of the picture : small, big
 * @property {string | undefined} url of the picture
 */
const props = defineProps<{
	url: string | undefined
	type: string
	isSelf: boolean
	status: UserStatus
	pictureDotSize: string
}>()

const userStore = useUserStore()
const defaultUrl = `https://${import.meta.env.VITE_BACKEND_URL}/uploads/default.png`
const imgUrl = ref(props.url || defaultUrl)
const statusClass = ref(props.status === 'ONLINE' ? 'green'
	: props.status === 'OFFLINE' ? 'gray'
	: props.status === 'AWAY' ? 'orange'
	: 'red')

const handleImageChange = (event: Event) => {
	const file = (event.target as HTMLInputElement).files![0]
	if (!file) return
	const formData = new FormData()
	formData.append('avatar', file, file.name)
	userStore.uploadAvatar(formData)
	imgUrl.value = userStore.user?.avatar || defaultUrl
}

const updateStatus = () => {
	if (props.isSelf) {
		userStore.updateStatus(props.status).then((status) => {
				statusClass.value = status === 'ONLINE' ? 'green'
				: status === 'OFFLINE' ? 'gray'
				: status === 'AWAY' ? 'orange'
				: 'red'
			}
		)
	}
}

onUpdated(() => {
	imgUrl.value = props.url || defaultUrl
})
</script>

<style scoped lang="scss">
.user_picture {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	.upload_button {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.3s ease;
		border-radius: 50%;
		overflow: hidden;

		&.small {
			height: 10vh;
			width: 10vh;
		}

		&.big {
			height: 20vh;
			width: 20vh;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>