<template>
    <section class="list_container">
        <ul class="users">
            <li
                class="user"
                v-for="user in userList"
                v-show="userStore.user.id !== user.user.id"
                @click="setSelectedUser(user.user)"
            >
                {{ user.user.username }}
            </li>
            <li v-if="userList.length === 1">
                You are alone in this channel
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import {useUserStore} from '@/stores/user'

const userStore = useUserStore()

const props = defineProps<{
    userList: any,
    setSelectedUser: (user: any) => void
}>()
</script>

<style scoped lang="scss">
.list_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 300px;
    width: 100%;
    border: 2px solid $tertiary;

    .users {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        overflow: auto;

        .user {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;
            border: 1px solid $tertiary;
            background: $secondary;
        }
    }
}
</style>