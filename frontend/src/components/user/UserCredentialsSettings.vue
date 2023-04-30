<template>
    <UsernameInput/>
    <ButtonCustom
        @click="openModal('TwoFA')"
        :style="'small'"
    >
        Manage TwoFA
    </ButtonCustom>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useModalStore } from '@/stores/modal'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import UsernameInput from '@/components/user/UsernameInput.vue'
import TwoFaInputs from '@/components/user/TwoFaInputs.vue'
import Modal from '@/components/modal/TheModal.vue'

const props = defineProps<{}>()
const modalStore = useModalStore()

const openModal = (modalName: string) => {
    if (modalName === 'TwoFA') {
        modalStore.loadAndDisplay(Modal, TwoFaInputs, {})
    }
}
</script>

<style scoped lang="scss">

</style>