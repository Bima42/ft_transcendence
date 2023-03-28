<template>

    <div id="wrapper">

        <GameSettings @joinCustom="onJoinCustom" @joinClassic="onJoinClassic"/>
        <CustomButton id="join_btn" @click="joinQueue">
            {{ isLoading ? 'Abort' : 'Join queue' }}
        </CustomButton>
        <LoadingGame v-if="isLoading"></LoadingGame>

    </div>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import CustomButton from '@/components/multiusage/CustomButton.vue'
import GameSettings from '@/components/game/GameSettings.vue'
import LoadingGame from '@/components/game/LoadingGame.vue';
import { useGameStore } from '@/stores/game';
import type IGame from '@/interfaces/game/IGame';
import { useRouter } from 'vue-router'

const router = useRouter()

const gameStore = useGameStore();
const isLoading = ref(false);
var useClassicMode = true;

function joinQueue() {
    isLoading.value = !isLoading.value
    // Joining queue !
    if (isLoading.value) {
        gameStore.socket.emit('newJoinQueue', {
            classic: useClassicMode
        }, (response: string) => { console.log(response)});
    }
    // Aborting queue
    else {
        gameStore.socket.emit('abortJoinQueue');
    }
}

function onJoinClassic() {
    useClassicMode = true;
    console.log("classic");
}

function onJoinCustom() {
    useClassicMode = false;
    console.log("custom");
}

// Listen for the 'match-found' event
gameStore.socket.on('matchFound', (match: IGame) => {
  (document.getElementById("join_btn") as HTMLButtonElement).disabled = true;
  gameStore.currentGame = match;

  // FIXME: get this info from server
  gameStore.currentGame.classic = useClassicMode;

  // Redirect the user to the game page with the opponent ID
  router.push(`game`);
});

gameStore.socket.on('connect', () => {
  console.log(`Connected to server with ID ${gameStore.socket.id}`);
});

gameStore.socket.on('matchFound', (opponentId: string) => {
  console.log(`Match found with opponent ${opponentId}`);
  isLoading.value = false;
  gameStore.socket.off('matchFound');
});



function joinCustomModeQueue() {
}

</script>

<style scoped lang="scss">
#wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    grid-area: $main;
}

#join_btn {
    font-size: 20px;
    margin-bottom: 20px;
}
</style>
