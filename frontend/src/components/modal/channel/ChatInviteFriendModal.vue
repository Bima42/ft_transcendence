<template>
    <section class="invite_friend_modal_wrap">
        <h2>Select a friend to invite</h2>
        <ul class="friends">
            <li
                v-for="(friend, x) in availableFriends"
                class="friend"
                :key="x"
                :id="friend.id.toString()"
                @click="handleClick(friend)"
            >
                {{ friend.username }}
            </li>
        </ul>
        <section class="footer_buttons">
            <ButtonCustom :style="'big'" @click="handleBack">
                Back
            </ButtonCustom>
            <ButtonCustom :style="'big'" @click="submitInvite">
                Invite
            </ButtonCustom>
        </section>
    </section>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import TheModal from '@/components/modal/TheModal.vue'
import EditChatModal from '@/components/modal/channel/EditChatModal.vue'
import { useModalStore } from '@/stores/modal'
import { useFriendStore } from '@/stores/friend'
import { useChatStore } from '@/stores/chat'
import { ref, computed } from 'vue'
import type IFriend from '@/interfaces/user/IFriend'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
const modalStore = useModalStore()
const friendStore = useFriendStore()
const chatStore = useChatStore()
const selectedFriend = ref<IFriend | null>()

const availableFriends = computed(() => {
    const allUsersID = Array.from(chatStore.currentChat!.users, x => x.user.id)
    return friendStore.friends.filter((friend) => {
        return !allUsersID?.includes(friend.id)
    })
})

const handleBack = () => {
    modalStore.loadAndDisplay(TheModal, EditChatModal, {})
}

const setSelectedFriend = (friend: IFriend) => {
    selectedFriend.value = friend
}

const handleClick = (friend: IFriend) => {
    setSelectedFriend(friend)
    let newSelection = document.getElementById(friend.id.toString()) as HTMLElement
    let oldSelection = document.getElementsByClassName('selected_friend')[0] as HTMLElement
    if (oldSelection) {
        oldSelection.classList.remove('selected_friend')
    }
    if (newSelection) {
        newSelection.classList.add('selected_friend')
    }
}

const submitInvite = async () => {
    if (!selectedFriend.value) {
        return
    }
    let oldSelection = document.getElementsByClassName('selected_friend')[0] as HTMLElement
    if (oldSelection) {
        oldSelection.classList.remove('selected_friend')
    }
    await chatStore.inviteFriendToChat(selectedFriend.value.username)
	.catch(e => alertStore.setErrorAlert(e))
}
</script>

<style scoped lang="scss">
.invite_friend_modal_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 15px;

    .friends {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        overflow: auto;

        .friend {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;
            border: 1px solid $tertiary;
            background: $secondary;
            cursor: pointer;

            &.selected_friend {
                background: $tertiary;
            }
        }
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
