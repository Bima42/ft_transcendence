<template>
	<section class="first_login_wrapper">
		<h2>Welcome on our Transcendence App !</h2>
		<p>This is your first connection, you can customize your profile, or directly go play some games !</p>
		<div class="buttons_wrapper">
			<ButtonCustom @click="goToProfile" class="button_custom" :style="'big'">Check my profile</ButtonCustom>
			<ButtonCustom @click="goToIndex" class="button_custom" :style="'big'">Let me play !</ButtonCustom>
		</div>
	</section>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal';

const modalStore = useModalStore()
const router = useRouter()

const goToProfile = () => {
	router.push('/main/profile')
	modalStore.toggleModal()
}

const goToIndex = () => {
	modalStore.toggleModal()
}
</script>

<style scoped lang="scss">
.first_login_wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: $small_gap;

	h2, p {
		text-align: center;
	}

	.buttons_wrapper {
		display: flex;
		flex-direction: row;
		margin-top: $medium_gap;
		gap: 50px;
	}
}
</style>