<template>
    <section class="sidebar_wrap">
        <span v-if="isActive" class="background" @click="outsideClickHandle"></span>
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
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const isActive = ref(false)
const userStore = useUserStore()
const router = useRouter()

const sidebarElement = ref({
    user: {
      icon: 'fa-user',
      id: 'user',
      route: '/profile'
    },
    friends: {
      icon: 'fa-user-friends',
      id: 'friends',
      route: '/main/friends'
    },
    chat: {
      icon: 'fa-comments',
      id: 'chat',
      route: '/main/community'
    },
    leaderboard: {
        icon: 'fa-ranking-star',
        id: 'leaderboard',
        route: '/main/leaderboard'
    },
    game: {
        icon: 'fa-gamepad',
        id: 'game',
        route: '/main/game'
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

const outsideClickHandle = () => {
    isActive.value = false
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

    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 8;
        background-color: transparent;
    }

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
            z-index: 9;

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