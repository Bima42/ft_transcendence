<template>
	<section class="search_profile_modal">
		<h1>Search Profile</h1>
		<div class="search_bar">
			<input class="input" type="text" name="search_profile" placeholder="Find a profile" v-model="searchedProfile" @keydown.enter="searchProfile" ref="input">
			<font-awesome-icon icon="fa-magnifying-glass" class="search_icon" @click="searchProfile"/>
		</div>
	</section>
	<YButton v-if="meow"></YButton>
</template>

<script setup lang="ts">
import {onMounted, onUpdated, ref} from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useAlertStore } from '@/stores/alert'
import YButton from '@/components/buttons/YButton.vue'

const alertStore = useAlertStore()
const userStore = useUserStore()
const modalStore = useModalStore()

const router = useRouter()
const searchedProfile = ref('')
const input = ref<HTMLInputElement | null>(null)
const meow = ref(false)

const searchProfile = () => {
	if (searchedProfile.value === 'I LOVE CATS UWU') {
		meow.value = true
		return
	}
	if (searchedProfile.value === '')
		return
	userStore.getUserInfosByUsername(searchedProfile.value).then((res) => {
		if (res.id === userStore.user?.id)
			router.push('/main/profile')
		else
			router.push(`/main/profile/${res.id}`)
		modalStore.resetState()
	}).catch((err) => {
		alertStore.setErrorAlert(err, () => input.value?.focus())
	})
}

onMounted(() => {
    input.value?.focus()
})
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
