<template>
    <section class="user_information_modal">
        <section class="user_data">
            <UserAvatar :type="'small'" :url="modalStore.data.user.avatar"></UserAvatar>
            <section class="data">
                <h2>{{ modalStore.data.user.username }}</h2>
                <section class="button_wrap">
                    <ButtonCustom :style="'small'" :click="checkIfFriend">
                        {{ isFriend ? 'Remove friend' : 'Add friend' }}
                    </ButtonCustom>
                    <ButtonCustom :style="'small'" :click="checkIfBlocked">
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
import { defineProps, ref } from 'vue'
import { useModalStore } from '@/stores/modal'
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';

const modalStore = useModalStore()

const props = defineProps<{}>()
const isBlocked = ref(false)
const isFriend = ref(false)

const checkIfBlocked = () => {
    // check if user is blocked
    // store it into isBlocked.data
    isBlocked.value = !isBlocked.value
}

const checkIfFriend = () => {
    // check if user is friend
    // store it into isFriend.data
    isFriend.value = !isFriend.value
}
</script>

<style scoped lang="scss">
.user_information_modal {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;

    hr {
        border-color: $tertiary;
        width: 80%;
        align-self: center;
    }

    .user_data {
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: center;
        align-items: center;

        .data {
            display: flex;
            flex-direction: column;
            gap: 10px;
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
        gap: 10px;
        justify-content: center;
        align-items: center;
    }
}

</style>