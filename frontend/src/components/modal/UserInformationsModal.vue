<template>
    <section class="user_information_modal">
        <section class="user_data">
            <UserPicture :type="'small'" :url="modalStore.data.user.avatar"></UserPicture>
            <section class="data">
                <h2>{{ modalStore.data.user.username }}</h2>
                <section class="button_wrap">
                    <UserInteractions :invitePlay="true"/>
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
import { useModalStore } from '@/stores/modal'
import UserPicture from '@/components/avatar/UserPicture.vue';
import UserInteractions from '@/components/user/UserInteractions.vue';

const modalStore = useModalStore()

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