<template>
    <div class="user_picture">
		<label for="file_input"  class="upload_button"  :class="props.type">
			<img :src="url" alt="User picture">
		</label>
		<input id="file_input" type="file" @change="handleImageChange" accept="image/*" style="display:none">
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onUpdated } from 'vue'
import { useUserStore } from '@/stores/user';

/**
 * @typedef {Object} Props
 * @property {string} existing type of the picture : small, big
 * @property {string | undefined} url of the picture
 */
const props = defineProps<{
    url: string | undefined
    type: string
}>()

const userStore = useUserStore()
const defaultUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/default.png`
const imgUrl = ref(props.url || defaultUrl)

const handleImageChange = (event: Event) => {
	const file = (event.target as HTMLInputElement).files![0]
	const formData = new FormData()
	formData.append('avatar', file, file.name)
	userStore.uploadAvatar(formData)
	imgUrl.value = userStore.user?.avatar || defaultUrl
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