<template>
    <section class="select_game_mode_wrap">
        <h2>Select the game mode you wish to play</h2>
		<h3 v-if="gameStore.currentGame">Opponent is {{ gameStore.currentGame.player2.username }} </h3>
        <div class="buttons_wrap">
            <ButtonCustom id="classic_btn" @click="onJoinClassic" :disabled="isLoading" :style="'big'"
                          :class="[useClassicMode ? 'selected' : '']">
                Classic
            </ButtonCustom>
            <ButtonCustom id="custom_btn" @click="onJoinCustom" :disabled="isLoading" :style="'big'"
                          :class="[useClassicMode ? '' : 'selected']">
                Custom
            </ButtonCustom>
        </div>
        <div class="join_button" v-if="!isLoading">
            <ButtonCustom id="join_btn" @click="joinQueue" :style="'big'">
			{{gameStore.currentGame ? "Invite" : "Join the queue" }}
            </ButtonCustom>
        </div>
        <div class="queue_wrapper" v-else>
            <h1>{{queueTimer}}s</h1>
            <img src="@/assets/img/loading.svg" alt="loading">
			<ButtonCustom @click="leaveQueue" :style="'big'">{{gameStore.currentGame ? "Cancel invite" : "Leave Queue" }} </ButtonCustom>
        </div>
    </section>
</template>

<script setup lang="ts">
import {onUnmounted, ref} from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import {useGameStore} from '@/stores/game'
import {useRouter} from 'vue-router'
import type IGameSettings from '@/interfaces/game/IGameSettings'

const router = useRouter()

const gameStore = useGameStore();

//const currentGame = ref<IGameSettings | null>(gameStore.currentGame)

const isLoading = ref(false);
const useClassicMode = ref(true);
const queueTimer = ref(0)
let queueTimerIntervalID = 0

function inviteToPlay() : boolean {
	console.log("invite !")
	gameStore.currentGame.game.type = useClassicMode.value ? 'CLASSIC' : 'CUSTOM'
	const invite = {
		gameType: gameStore.currentGame.game.type,
		userId: gameStore.currentGame.player2.id,
	}
	gameStore.socket.emit("invitePlayer", invite, ((res: string) => {
		if (res !== "OK") {
			cancelInvitation()
			window.alert(res)
		}
	}))
}

function joinQueue() {
    isLoading.value = !isLoading.value
	if (!isLoading.value) { return; }

	if (gameStore.currentGame) {
		inviteToPlay()
	}
	else {
		console.log(`join queue`)
		gameStore.socket.emit('newJoinQueue', {
			type: useClassicMode.value ? 'CLASSIC' : 'CUSTOM'
		});
	}

	gameStore.socket.once('matchFound', (gameSettings: IGameSettings) => {
		console.log(`match found !`)
		isLoading.value = false;
		gameStore.socket.off("invitationDeclined")
		router.push(`game`);
	});
	gameStore.socket.once("invitationDeclined", (gameSettings: IGameSettings) => {
		console.log(`invitation declined :(`)
		isLoading.value = false
		gameStore.socket.off("invitationDeclined")
		gameStore.socket.off("matchFound")
		router.push('index')
		// Go back to index to avoid spam to opponent
		setTimeout(() => {
			window.alert(`${gameSettings.player2.username} refused your invitation.`)
		}, 50);
	})

	// This is ubercrade
	queueTimerIntervalID = setInterval(() => {
		queueTimer.value += 1
	}, 1000)
}

function cancelInvitation() {
	gameStore.socket.off("matchFound")
	gameStore.socket.off("invitationDeclined")
	gameStore.socket.emit("cancelInvitation", gameStore.currentGame)
	gameStore.currentGame = null
	router.push('index')
}

function leaveQueue() {
	//cancel invitation
	if (gameStore.currentGame) {
		cancelInvitation()
	}
	else {
		console.log(`leave queue`)
		gameStore.socket.emit('abortJoinQueue')
	}
	queueTimer.value = 0
	isLoading.value = false
	clearInterval(queueTimerIntervalID)
}

function onJoinClassic() {
    useClassicMode.value = true;
}

function onJoinCustom() {
    useClassicMode.value = false;
}


gameStore.socket.on('connect', () => {
    console.log(`Connected to server with ID ${gameStore.socket.id}`);
});

onUnmounted(() => {
	if (gameStore.currentGame) {
		//cancelInvitation();
	}
	clearInterval(queueTimerIntervalID)
})

</script>

<style scoped lang="scss">
.select_game_mode_wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    grid-area: $bigmain;
    gap: 20px;
    text-align: center;

    .buttons_wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;

        .selected {
            background: $tertiary;
        }
    }

    .join_button, .queue_wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: $medium-gap;

        img {
            max-width: 250px;
        }
    }
}
</style>
