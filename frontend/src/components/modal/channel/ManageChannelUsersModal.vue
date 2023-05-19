<template>
    <section class="manage_users_channel_modal_wrap">
        <section class="modal_header">
            <h2>Channel users</h2>
        </section>
        <section class="modal_body">
            <ChatUsersList
                v-if="!takeActionView"
                :setSelectedUser="setSelectedUser"
            />
            <TakeActionOnUser
                v-else
                :selectedUser="selectedUser as IUserChat"
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
            <ButtonCustom :style="'big'" v-if="selectedUser && userRole >= UserChatRoleEnum.Admin" @click="takeAction">
                {{ (selectedAction ?? 'Take action on') + ' ' + selectedUser.user.username }}
            </ButtonCustom>
        </section>
        <ButtonCustom :style="'big'" v-if="selectedUser" @click="handleUserProfileClick">
            View profile
        </ButtonCustom>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheModal from '@/components/modal/TheModal.vue'
import EditChatModal from '@/components/modal/channel/EditChatModal.vue'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import ChatUsersList from '@/components/chat/ChatUsersList.vue'
import TakeActionOnUser from '@/components/chat/TakeActionOnUser.vue'
import type IUserChat from '@/interfaces/user/IUserChat'
import { UserChatRoleEnum } from '@/interfaces/user/IUserChat'
import { useRouter } from 'vue-router'

const modalStore = useModalStore()
const chatStore = useChatStore()
const userStore = useUserStore()
const router = useRouter()

const userRole = chatStore.getRoleFromUserId(userStore.user?.id || 0)
const selectedUser = ref<IUserChat>()
const takeActionView = ref(false)
const selectedAction = ref<string | null>(null)
const muteTime = ref(1)

const handleUserProfileClick = () => {
    if (selectedUser.value) {
        router.push(`/main/profile/${selectedUser.value.user.id}`)
        modalStore.resetState()
    }
}

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
        chatStore.takeActionOnUser(selectedUser.value.user.username, selectedAction.value, muteTime.value)
            .then(() => {
                chatStore.updateStore()
            })
            .catch(err => {
                alert(err.message)
            })
        // then we reset the values
        resetVariables()
        return
    }
    takeActionView.value = !takeActionView.value
}

const setSelectedUser = (user: IUserChat) => {
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
