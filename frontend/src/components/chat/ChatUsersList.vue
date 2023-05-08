<template>
    <section class="list_container">
        <ul class="users">
            <li
                class="user"
                v-for="user in chatStore.currentChat.users"
                :key="user.user.id"
                :id="user.user.id"
                v-show="userStore.user.id !== user.user.id"
                @click="handleClick(user.user)"
            >
                {{ user.user.username }}
                <div class="svg_wrapper">
                    <font-awesome-icon v-if="user.role === 'OWNER'" icon="fa-crown" color="gold"/>
                    <font-awesome-icon v-if="user.role === 'BANNED'" icon="fa-ban" color="red"/>
                    <font-awesome-icon v-if="user.role === 'MEMBER'" icon="fa-user"/>
                    <font-awesome-icon v-if="user.role === 'ADMIN'" icon="fa-user-astronaut" color="teal"/>
                    <font-awesome-icon v-if="user.mutedUntil && new Date(user.mutedUntil) >= Date.now()" icon="fa-volume-xmark" color="brown"/>
                </div>
            </li>
            <li v-if="chatStore.currentChat.users.length === 1">
                You are alone in this channel
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import type IUser from '@/interfaces/user/IUser'

const userStore = useUserStore()
const chatStore = useChatStore()

const props = defineProps<{
    setSelectedUser: (user: any) => void
}>()

const handleClick = (user: IUser) => {
    let newSelection = document.getElementById(user.id.toString()) as HTMLElement
    let oldSelection = document.getElementsByClassName('selected_user')[0] as HTMLElement
    if (oldSelection) {
        oldSelection.classList.remove('selected_user')
    }
    if (newSelection) {
        newSelection.classList.add('selected_user')
    }
    props.setSelectedUser(user)
}
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
        cursor: pointer;

        .user {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 10px;
            border: 1px solid $tertiary;
            background: $secondary;

            .svg_wrapper {
                display: flex;
                gap: 5px;
            }

            &.selected_user {
                background: $tertiary;
            }
        }
    }
}
</style>