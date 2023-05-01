<template>
    <section class="sidebar_wrap">
        <button @click="toggleSidebar">
            <font-awesome-icon icon="fa-bars"/>
        </button>
        <div :class="['sidebar_menu', isActive ? 'active' : '']">
            <div v-for="element in sidebarElement" :id="element.id" @click="handleClick(element.route)">
                <font-awesome-icon :icon="element.icon" :id="element.id"/>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useUserStore} from '@/stores/user'
import {useRouter} from 'vue-router'

const isActive = ref(false)
const userStore = useUserStore()
const router = useRouter()

const sidebarElement = ref({
    game: {
        icon: 'fa-gamepad',
        id: 'game',
        route: '/main/game'
    },
    chat: {
        icon: 'fa-comments',
        id: 'chat',
        route: '/main/community'
    },
    user: {
        icon: 'fa-user',
        id: 'user',
        route: '/settings'
    },
    friends: {
        icon: 'fa-user-friends',
        id: 'friends',
        route: '/main/friends'
    },
    logout: {
        icon: 'fa-arrow-right-from-bracket',
        id: 'logout',
        route: 'LOGOUT'
    }
})

const toggleSidebar = () => {
    isActive.value = !isActive.value
}

const handleClick = (route: string) => {
    if (!route)
        return
    toggleSidebar()
    if (route === 'LOGOUT')
        userStore.logout()
    else
        router.push(route)
}
</script>

<style scoped lang="scss">
.sidebar_wrap {
    grid-area: header3 / header3-end / footer2-end / footer2-start;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 10px;
    overflow: hidden;

    button {
        position: absolute;
        top: 18px;
        right: 18px;
        background-color: transparent;
        border: 0;
        transition: background-color 0.5s ease-in-out;
        cursor: pointer;

        svg {
            font-size: 30px;
            color: $tertiary;
        }
    }

    .sidebar_menu {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        max-width: 60px;
        gap: 20px;
        background-color: $secondary;
        border: 1px solid $tertiary;
        border-right: 0;
        border-radius: 20px 0 0 20px;
        padding: 20px 0 20px 0;
        transition: transform 0.5s ease-in-out;
        transform: translateX(100%);
        cursor: pointer;
        z-index: 200;

        svg {
            color: $tertiary;
            font-size: 30px;

            &[id='logout'] {
                color: red;
            }
        }

        &.active {
            transform: translateX(0);
        }
    }
}
</style>