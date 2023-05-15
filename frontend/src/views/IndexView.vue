<template>
    <section class="index_wrapper">
        <div class="main_text">
            <h1>Welcome to transcendence</h1>
        </div>
        <router-link to="/main/joinGame" class="slide_right">
            Start playing
        </router-link>
        <router-link to="/main/community" class="slide_right">
            Start Chatting
        </router-link>
        <router-link to="/main/profile" class="slide_right">
            Profile
        </router-link>
        <router-link to="/main/friends" class="slide_right">
            Friends
        </router-link>
        <router-link to="/main/leaderboard" class="slide_right">
            Leaderboard
        </router-link>
    </section>
</template>

<script setup lang="ts">
import type IGameSettings from '@/interfaces/game/IGameSettings';
import { useChatStore } from '@/stores/chat';
import { useGameStore } from '@/stores/game';
import { useRouter } from 'vue-router';

const router = useRouter()
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
    gap: $medium_gap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;

    .slide_right {
        -webkit-animation: slide_right 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
        animation: slide_right 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
    }

    h1 {
        background-image: linear-gradient(to right, $tertiary, $quaternary);
        -webkit-text-fill-color: transparent;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        -webkit-background-clip: text;
        font-size: 3em;
    }
}


@-webkit-keyframes slide_right {
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

@keyframes slide_right {
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
