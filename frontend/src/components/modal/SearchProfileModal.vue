<template>
	<section class="search_profile_modal">
		<h1>Search Profile</h1>
		<div class="search_bar">
			<input class="input" type="text" name="search_profile" placeholder="Find a profile" v-model="searchedProfile" @keydown.enter="searchProfile">
			<font-awesome-icon icon="fa-magnifying-glass" class="search_icon" @click="searchProfile"/>
		</div>
        <button @click="alertStore.error = !alertStore.error">toggle error</button>
        <button @click="alertStore.show = true">Show alert</button>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useAlertStore } from '@/stores/alert'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';

const alertStore = useAlertStore()
const userStore = useUserStore()
const modalStore = useModalStore()

const router = useRouter()
const searchedProfile = ref('')

//TODO: add error handling
const searchProfile = () => {
	userStore.getUserInfosByUsername(searchedProfile.value).then((res) => {
		if (res.id === userStore.user?.id)
			router.push('/main/profile')
		else
			router.push(`/main/profile/${res.id}`)
		modalStore.resetState()
	}).catch((err) => {
		alert(err.message)
	})
}
</script>

<style scoped lang="scss">
.search_profile_modal {
	display: flex;
	flex-direction: column;
	gap: $large_gap;
	justify-content: center;
	align-items: center;

	h1 {
		font-size: 1.5rem;
	}

	.search_bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0 10px;
		background-color: #fff;
		border: 2px solid $tertiary;
		border-radius: 100px;
		box-sizing: border-box;

		.input {
			margin: 0 15px;
			background-color: transparent;
			width: 100%;
			border: none;
			outline: none;
			font-size: 1.2rem;
		}

		.search_icon {
			color: $background;
			cursor: pointer;
		}
	}
}
</style>