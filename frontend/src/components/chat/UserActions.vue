<template>
    <section class="user_actions">
        <h2>{{ modalStore.data.username }}</h2>
        <ButtonCustom :style="'big'" :click="toggleNewModal">
            View profile
        </ButtonCustom>
        <section class="chat_actions_buttons">
            <template v-if="userRole === role.admin">
                <h4>Admin actions</h4>
                <section class="button_wrap">
                    <ButtonCustom :style="'small'">
                        kick
                    </ButtonCustom>
                    <ButtonCustom :style="'small'">
                        ban
                    </ButtonCustom>
                    <ButtonCustom :style="'small'">
                        mute
                    </ButtonCustom>
                    <ButtonCustom :style="'small'">
                        promote
                    </ButtonCustom>
                    <ButtonCustom :style="'small'">
                        demote
                    </ButtonCustom>
                </section>
            </template>
            <template v-if="userRole <= role.user">
                <section class="button_wrap">
                    <ButtonCustom :style="'small'" :click="addOrRemoveFriend" :disabled="isRequestSent">
                      {{ isFriend ? 'Remove friend' : isRequestSent ? 'Request pending ...' : 'Add friend' }}
                    </ButtonCustom>
                    <ButtonCustom :style="'small'" :click="blockOrUnblockUser">
                      {{ isBlocked ? 'Unblock' : 'Block' }}
                    </ButtonCustom>
                </section>
            </template>
        </section>
    </section>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue'
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import { useFriendStore } from '@/stores/friend';

enum role { admin = 0, user = 1 }

const modalStore = useModalStore()
const friendStore = useFriendStore()

const props = defineProps<{}>()
const isBlocked = ref(false)
const isFriend = ref(false)
const canUnblock = ref(false)
const isRequestSent = ref(false)

// WE NEED A FUNCTION TO CATCH THE ROLE OF A USER TO DISPLAY WHAT HE CAN AND CANNOT DO
// onMounted(async () => {
//     await userRole = chatStore.getRole()
// })
const userRole = role.user

const toggleNewModal = () => {
    modalStore.resetStateKeepData()
    modalStore.loadAndDisplay(TheModal, UserInformations, {...modalStore.data})
}

const blockOrUnblockUser = async () => {
  if (isBlocked.value && canUnblock.value) {
    isBlocked.value = !(await friendStore.unblockUser(modalStore.data.user.username))
  } else {
    isBlocked.value = await friendStore.blockUser(modalStore.data.user.username)
  }
}

const addOrRemoveFriend = async() => {
  if (isFriend.value) {
    isFriend.value = !(await friendStore.removeFriend(modalStore.data.user.username))
  } else {
    isRequestSent.value = await friendStore.addFriend(modalStore.data.user.username)
  }
}

onMounted(async () => {
  isFriend.value = await friendStore.isFriend(modalStore.data.user.username)
  isRequestSent.value = await friendStore.isWaitingRequest(modalStore.data.user.username)
  isBlocked.value = await friendStore.isBlocked(modalStore.data.user.username)
  canUnblock.value = await friendStore.canUnblock(modalStore.data.user.username)
})
</script>

<style scoped lang="scss">
.user_actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;

    .chat_actions_buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;

        .button_wrap {
            display: flex;
            justify-content: center;
            flex-direction: row;
            gap: 5px;
            flex-wrap: wrap;
        }
    }
}
</style>