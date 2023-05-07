<template>
    <section class="user_information_modal">
        <section class="user_data">
            <UserPicture :type="'small'" :url="modalStore.data.user.avatar"></UserPicture>
            <section class="data">
                <h2>{{ modalStore.data.user.username }}</h2>
                <section class="button_wrap">
                    <ButtonCustom :style="'small'" :click="addOrRemoveFriend" :disabled="isRequestSent">
                        {{ isFriend ? 'Remove friend' : 'Add friend' }}
                    </ButtonCustom>
                    <ButtonCustom :style="'small'" :click="blockOrUnblockUser">
                        {{ isBlocked ? 'Unblock' : 'Block' }}
                    </ButtonCustom>
                    <ButtonCustom :style="'small'">
                        Invite to play a game
                    </ButtonCustom>
                </section>
            </section>
        </section>
        <hr>
        <section class="user_score">
            <h4>Score</h4>
            <h4>Some big numbers whew</h4>
        </section>
    </section>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { useModalStore } from '@/stores/modal'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import UserPicture from '@/components/avatar/UserPicture.vue';
import { useFriendStore } from '@/stores/friend';

const modalStore = useModalStore()
const friendStore = useFriendStore()

const props = defineProps<{}>()
const isBlocked = ref(false)
const isFriend = ref(false)

const isRequestSent = ref(false)
const canUnblock = ref(false)

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
.user_information_modal {
    display: flex;
    flex-direction: column;
    gap: $medium_gap;
    justify-content: center;

    hr {
        border-color: $tertiary;
        width: 80%;
        align-self: center;
    }

    .user_data {
        display: flex;
        flex-direction: row;
        gap: $small_gap;
        justify-content: center;
        align-items: center;

        .data {
            display: flex;
            flex-direction: column;
            gap: $small_gap;
            justify-content: center;
            align-items: flex-start;

            .button_wrap {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                gap: 5px;
                flex-wrap: wrap;
            }
        }
    }
    .user_score {
        display: flex;
        flex-direction: column;
        gap: $small_gap;
        justify-content: center;
        align-items: center;
    }
}

</style>