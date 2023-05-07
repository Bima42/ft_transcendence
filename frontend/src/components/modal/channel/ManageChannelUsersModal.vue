<template>
    <section class="manage_users_channel_modal_wrap">
        <section class="modal_header">
            <h2>Manage channel users</h2>
        </section>
        <section class="modal_body">
            <ChatUsersList
                v-if="!takeActionView"
                :userList="chatStore.currentChat.users"
                :setSelectedUser="setSelectedUser"
            />
            <TakeActionOnUser
                v-else
                :selectedUser="selectedUser"
            />
        </section>
        <section class="footer_buttons">
            <ButtonCustom :style="'big'" @click="handleBack">
                Back
            </ButtonCustom>
            <ButtonCustom :style="'big'" v-if="selectedUser" @click="toggleTakeActionView">
                Take action on {{ selectedUser.username }}
            </ButtonCustom>
        </section>
    </section>
</template>

<script setup lang="ts">
import TheModal from '@/components/modal/TheModal.vue'
import EditChatModal from '@/components/modal/channel/EditChatModal.vue'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import ChatUsersList from '@/components/chat/ChatUsersList.vue'
import { ref } from 'vue'
import TakeActionOnUser from '@/components/chat/TakeActionOnUser.vue'
import type IUser from '@/interfaces/user/IUser';

const modalStore = useModalStore()
const chatStore = useChatStore()

const selectedUser = ref<IUser>()
const takeActionView = ref(false)
const handleBack = () => {
    if (takeActionView.value) {
        takeActionView.value = false
        selectedUser.value = undefined
        return
    }
    modalStore.loadAndDisplay(TheModal, EditChatModal, {})
}

const toggleTakeActionView = () => {
    takeActionView.value = !takeActionView.value
}

const setSelectedUser = (user: IUser) => {
    selectedUser.value = user
}
</script>

<style scoped lang="scss">
.manage_users_channel_modal_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .modal_header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .modal_body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .footer_buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
}

</style>