<template>
	<section class="user_credentials">
		<UsernameInput/>
		<ButtonCustom
			@click="openModal('TwoFA')"
			:style="'small adapt'"
		>
			{{ userStore.user?.twoFA ? 'Deactivate TwoFA' : 'Activate TwoFA' }}
		</ButtonCustom>
	</section>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import UsernameInput from '@/components/user/UsernameInput.vue'
import TwoFaInputs from '@/components/user/TwoFaInputs.vue'
import Modal from '@/components/modal/TheModal.vue'

const modalStore = useModalStore()
const userStore = useUserStore()


const openModal = (modalName: string) => {
    if (modalName === 'TwoFA') {
        if (userStore.user?.twoFA) {
            userStore.updateTwoFaStatus(false)
            return
        }
        else {
            modalStore.loadAndDisplay(Modal, TwoFaInputs, {})
        }
    }
}
</script>

<style scoped lang="scss">
.user_credentials, .user_infos {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: $medium_gap;
}
</style>
