<template>
    <div class="option_wrap">
        <h2>Select the actions you wish to perform</h2>
        <ButtonCustom :style="'big'" :click="() => handleClick('manageChannelUsers')">
            <h1>Channel users</h1>
        </ButtonCustom>
		<template v-if="userRole >= UserChatRoleEnum.Owner">
        <ButtonCustom :style="'big'" :click="() => handleClick('manageChannel')">
            <h1>Manage channel</h1>
        </ButtonCustom>
		</template>
        <ButtonCustom :style="'big'" :click="() => handleClick('inviteFriend')">
            <h1>Invite friend</h1>
        </ButtonCustom>
        <ButtonCustom :style="'big danger'" :click="() => handleClick('leaveChat')">
            <h1>Leave chat</h1>
        </ButtonCustom>
    </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import TheModal from '@/components/modal/TheModal.vue'
import manageChannelUsersModal from '@/components/modal/channel/ManageChannelUsersModal.vue'
import manageChannelModal from '@/components/modal/channel/ManageChannelModal.vue'
import chatInviteFriendModal from '@/components/modal/channel/ChatInviteFriendModal.vue'
import { ref } from 'vue'
import { UserChatRoleEnum } from '@/interfaces/user/IUserChat'

const modalStore = useModalStore()
const chatStore = useChatStore()
const userStore = useUserStore()
const userRole = ref(chatStore.getRoleFromUserId(userStore.user?.id || 0))

const handleClick = (option: string) => {
    switch (option) {
        case 'manageChannelUsers':
			chatStore.refreshCurrentChat()
            modalStore.loadAndDisplay(TheModal, manageChannelUsersModal, {})
            break
        case 'manageChannel':
			chatStore.refreshCurrentChat()
            modalStore.loadAndDisplay(TheModal, manageChannelModal, {})
            break
        case 'inviteFriend':
            modalStore.loadAndDisplay(TheModal, chatInviteFriendModal, {})
            break
		case 'leaveChat':
			if (confirm("Are you sure you want to leave the channel ?")) {
				chatStore.leaveChannel(chatStore.currentChat?.id || 0)
				.then(() => {
					chatStore.resetState()
					modalStore.resetState()
				})
				.catch((e) => alert(e.message))
			}
			break
        default:
            break
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
    text-align: center;

    &:hover {
        cursor: pointer;
    }
}
</style>
