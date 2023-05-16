<template>
    <section class="sidebar_wrap">
        <span v-if="isActive" class="background" @click="outsideClickHandle"></span>
	<button class="search_button" @click="searchProfile">
		<font-awesome-icon icon="fa-magnifying-glass" />
	</button>
	<button @click="toggleSidebar">
            <font-awesome-icon icon="fa-bars" v-if="!isActive"/>
            <font-awesome-icon icon="fa-xmark" v-if="isActive"/>
        </button>
        <div :class="['sidebar_menu', isActive ? 'active' : '']">
            <div v-for="(element, index) in sidebarElement" :id="element.id" @click="handleClick(element.route)" :key="index">
                <font-awesome-icon :icon="element.icon" :id="element.id"/>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import TheModal from '@/components/modal/TheModal.vue'
import SearchProfileModal from '@/components/modal/SearchProfileModal.vue'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat';
import { useGameStore } from '@/stores/game';

const userStore = useUserStore()
const modalStore = useModalStore()
const chatStore = useChatStore()
const gameStore = useGameStore()
const router = useRouter()
const isActive = ref(false)

const sidebarElement = ref({
    user: {
      icon: 'fa-user',
      id: 'user',
      route: '/main/profile'
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
        route: '/main/joinGame'
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

const searchProfile = () => {
	modalStore.loadAndDisplay(TheModal, SearchProfileModal, {})
}

const handleClick = (route: string) => {
    if (!route)
        return
    toggleSidebar()
    if (route === 'LOGOUT') {
		userStore.logout()
		chatStore.socket.disconnect()
		gameStore.socket.disconnect()
		router.push('/')
	}
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
    gap: $small_gap;
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
		background-color: transparent;
		border: 0;
		transition: background-color 0.5s ease-in-out;
		cursor: pointer;
		top: 18px;

		svg {
			font-size: 30px;
			color: $tertiary;
		}
	}

	.search_button {
		right: 40px;
	}

	.sidebar_button {
        right: 18px;
    }

    .sidebar_menu {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        max-width: 60px;
        gap: $medium_gap;
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
