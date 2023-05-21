<template>
		<section class="login-wrapper">
			<img src="@/assets/img/logo_name.svg" alt="logo" class="logo">
			<ButtonCustom :loading="loading" :click="login" :style="'login'">
				Login with 42
			</ButtonCustom>
			<ButtonCustom v-if="is_dev" styles="fat" @click="loginAsBob">Login as bob</ButtonCustom>
		</section>
		<CreditLink/>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import CreditLink from '@/components/footers/CreditLink.vue'

async function loginAsBob() {
	const redirect = 'https://localhost:4443/api/auth/bob'
	window.open(redirect, '_self')
}

const loading = ref(false)
const is_dev = ref(import.meta.env.DEV)

const loginRedirect = () => {
	let redirect = 'https://api.intra.42.fr/oauth/authorize?client_id='
	redirect += import.meta.env.VITE_FORTYTWO_API_UID + '&redirect_uri=';
	redirect += encodeURIComponent(import.meta.env.VITE_FORTYTWO_API_CALLBACK) + '&response_type=code';
	window.open(redirect, '_self')
}

async function login() {
	loading.value = true;
	loginRedirect()
}
</script>

<style scoped lang="scss">
.login-wrapper {
	grid-area: $bigmain;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 90%;
	height: 100%;
	gap: 40px;
	animation: appear 1s cubic-bezier(.25, .46, .45, .94) forwards;

	img {
		animation: slide-top 1s cubic-bezier(.25, .46, .45, .94) forwards;
	}

	@keyframes slide-top {
		0% {
			transform: translateY(-100px);
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}
	@keyframes appear {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 100%;
		}
	}
}
</style>
