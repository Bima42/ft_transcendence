<template>
    <section class="manage_users_channel_modal_wrap">
        <section class="modal_header">
            <h2>Manage channel users</h2>
        </section>
        <section class="modal_body">
            <ChatUsersList
                v-if="!takeActionView"
                :setSelectedUser="setSelectedUser"
            />
            <TakeActionOnUser
                v-else
                :selectedUser="selectedUser"
                :setAction="setAction"
            />
            <section v-if="selectedAction === 'mute'">
                <form>
                    <label for="muteTime">Mute time (minutes) </label>
                    <input
                        v-model="muteTime"
                        type="number"
                        required
                        :min="1"
                        :max="999"
                        pattern="[1-9][0-9]{0,2}"
                    />
                </form>
            </section>
        </section>
        <section class="footer_buttons">
            <ButtonCustom :style="'big'" @click="handleBack">
                Back
            </ButtonCustom>
            <ButtonCustom :style="'big'" v-if="selectedUser" @click="takeAction">
                {{ (selectedAction ?? 'Take action on') + ' ' + selectedUser.username }}
            </ButtonCustom>
        </section>
    </section>
</template>

<script setup lang="ts">
import TheModal from '@/components/modal/TheModal.vue'
import EditChatModal from '@/components/modal/channel/EditChatModal.vue'
import {useModalStore} from '@/stores/modal'
import {useChatStore} from '@/stores/chat'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import ChatUsersList from '@/components/chat/ChatUsersList.vue'
import {ref} from 'vue'
import TakeActionOnUser from '@/components/chat/TakeActionOnUser.vue'
import type IUser from '@/interfaces/user/IUser';

const modalStore = useModalStore()
const chatStore = useChatStore()

const selectedUser = ref<IUser>()
const takeActionView = ref(false)
const selectedAction = ref<string | null>(null)
const muteTime = ref(1)

const resetVariables = () => {
    selectedUser.value = undefined
    takeActionView.value = false
    selectedAction.value = null
    muteTime.value = 1
}
const handleBack = () => {
    if (takeActionView.value) {
        resetVariables()
        return
    }
    modalStore.loadAndDisplay(TheModal, EditChatModal, {})
}

const takeAction = () => {
    if (takeActionView.value && selectedAction.value && selectedUser.value) {
        if (selectedAction.value === 'mute' && (muteTime.value <= 0 || muteTime.value > 999)) {
            //TODO: error !
            return
        }
        // do the action selected CARE IF MUTE ! USE MUTE TIME REF
        // then we reset the values
        resetVariables()
        return
    }
    takeActionView.value = !takeActionView.value
}

const setSelectedUser = (user: IUser) => {
    selectedUser.value = user
}

const setAction = (action: string) => {
    if (!selectedUser.value) {
        return
    }
    selectedAction.value = action
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
        gap: 10px;
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