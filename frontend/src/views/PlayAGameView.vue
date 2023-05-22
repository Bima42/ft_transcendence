<template>
	<section class="gamePong">
		<Suspense v-if="gameStore.currentGame">
			<PhaserContainer />
			<template #fallback>
				<div class="placeholder">
					Downloading ...
				</div>
			</template>
		</Suspense>
	</section>
</template>

<script setup lang="ts">
import PhaserContainer from '@/components/PhaserContainer.vue'
import { get } from '../../utils'
import { useNotificationStore } from '@/stores/notification'
import { onMounted, onUnmounted } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'
import type IGameSettings from '@/interfaces/game/IGameSettings'

const gameStore = useGameStore()
const alertStore = useAlertStore()
const notificationStore = useNotificationStore()
const router = useRouter()
notificationStore.show = false

// Get the current game from the server and put it into the store
if (!gameStore.currentGame) {
	get('game/current', "Cannot get game config")
		.then((gameSettings: IGameSettings) => {
			gameStore.currentGame = gameSettings
		})
		.catch((e) => {
			alertStore.setErrorAlert(e, () => router.push('joinGame'))
		})
}
//else {
//	gameStore.currentGame = {
//		game: {
//			type: "CLASSIC",
//			status: "STARTED",
//			users: []
//		},
//		player1: {
//			id: 1,
//			username: "Toto",
//			email: "toto@tata.com",
//			status: "BUSY",
//			avatar: "asdf",
//			chats: [],
//			games: [],
//			messages: [],
//			friendRequest: [],
//			twoFA: false,
//			blocked: [],
//		},
//		player2: {
//			id: 1,
//			username: "Titi",
//			email: "toto@tata.com",
//			status: "BUSY",
//			avatar: "asdf",
//			chats: [],
//			games: [],
//			messages: [],
//			friendRequest: [],
//			twoFA: false,
//			blocked: [],
//		}
//	}
//}

onUnmounted(() => {
	notificationStore.show = true
	gameStore.currentGame = null
})
</script>

<style scoped lang="scss">
.gamePong {
	grid-area: $bigmain;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 80%;
	height: 100%;
}
</style>
