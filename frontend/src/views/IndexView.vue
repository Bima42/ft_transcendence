<template>
    <section class="index_wrapper">
        <div class="main_text">
            <img src="@/assets/img/logo_name.svg" alt="logo" class="logo slide_down">
        </div>
        <router-link to="/main/joinGame" class="slide_down">
            Play
        </router-link>
        <router-link to="/main/community" class="slide_down">
            Chat
        </router-link>
        <router-link to="/main/profile" class="slide_down">
            Profile
        </router-link>
        <router-link to="/main/friends" class="slide_down">
            Friends
        </router-link>
        <router-link to="/main/leaderboard" class="slide_down">
            Leaderboard
        </router-link>
    </section>
</template>

<script setup lang="ts">
import type IGameSettings from '@/interfaces/game/IGameSettings'
import { useChatStore } from '@/stores/chat'
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'
import { useFriendStore } from '@/stores/friend'

const router = useRouter()

const friendStore = useFriendStore()
friendStore.updateStoreDatas()

// DO NOT REMOVE: used to initialize the websocket
const gameStore = useGameStore()

gameStore.socket.on("gameInvitation", (gameSettings: IGameSettings) => {
	console.log(`Received invitation: ${JSON.stringify(gameSettings)} !`)
	// TODO: silent refuse if already in a game (already checked on server)
	const accept = confirm(`Play with ${gameSettings.player1.username} ?`)
	if (accept) {
		gameStore.socket.emit("acceptInvitation", gameSettings)
		console.log("Let's play !")
		router.push('game')
	} else {
		gameStore.socket.emit("declineInvitation", gameSettings)
		console.log("Maybe not now")
	}
})
// DO NOT REMOVE` used to initialize the websocket
const chatStore = useChatStore()

</script>

<style scoped lang="scss">
a {
    color: $quaternary;
    text-decoration: none;
    font-size: 1.5em;
    transition: scale 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        text-decoration: none;
        scale: 120%;
        color: $tertiary;
    }
}

.index_wrapper {
    grid-area: $bigmain;
    display: flex;
    gap: $medium_gap * 1.5;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;

    .slide_down {
        -webkit-animation: slide_down 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
        animation: slide_down 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
    }

    .main_text {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25vh;

        .logo {
            width: 100vw;
            max-width: 1080px;
        }
    }
}


@-webkit-keyframes slide_down {
    0% {
        -webkit-transform: translateY(-100px);
        transform: translateY(-100px);
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 100;
    }
}

@keyframes slide_down {
    0% {
        -webkit-transform: translateY(-100px);
        transform: translateY(-100px);
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 100;
    }
}
</style>
