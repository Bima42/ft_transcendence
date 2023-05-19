<template>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal';
import { useRoute, useRouter } from 'vue-router'
import FirstLoginModal from '@/components/modal/FirstLoginModal.vue';
import TheModal from '@/components/modal/TheModal.vue';

const userStore = useUserStore()
const modalStore = useModalStore()
const route = useRoute()
const router = useRouter()
const firstLogin = route.query.firstLogin

// This function can be used later for any redirect
function redirectUser() {
	if (route.params.target === 'login') {
		userStore.login().then((res) => {
			if (res) {
				if (firstLogin == 'true') {
					modalStore.loadAndDisplay(TheModal, FirstLoginModal, {})
				}
				router.push('/main/index')
			}
			else {
				userStore.resetState()
				router.replace('/')
			}
		})
	}
}
redirectUser();
</script>
