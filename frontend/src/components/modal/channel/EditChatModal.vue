<template>
    <div class="option_wrap">
        <ButtonCustom :style="'big'" :click="() => handleClick('manageChannelUsers')">
            <h1>manage channel users</h1>
        </ButtonCustom>
        <ButtonCustom :style="'big'" :click="() => handleClick('manageChannel')">
            <h1>manage channel</h1>
        </ButtonCustom>
    </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue'
import manageChannelUsersModal from '@/components/modal/channel/ManageChannelUsersModal.vue'
import manageChannelModal from '@/components/modal/channel/ManageChannelModal.vue'

const modalStore = useModalStore()

const handleClick = (option: string) => {
    switch (option) {
        case 'manageChannelUsers':
            modalStore.loadAndDisplay(TheModal, manageChannelUsersModal, {})
            break
        case 'manageChannel':
            modalStore.loadAndDisplay(TheModal, manageChannelModal, {})
            break
        default:
            console.log('default')
    }
}
</script>

<style scoped lang="scss">
.option_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: bold;

    &:hover {
        cursor: pointer;
    }
}
</style>