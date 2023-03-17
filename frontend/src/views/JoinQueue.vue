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
import CustomButton from '@/components/CustomButton.vue'
import GameSettings from '@/components/game/GameSettings.vue'
import LoadingGame from '@/components/game/LoadingGame.vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();
const isLoading = ref(false);
var useClassicMode = false;

function joinQueue() {
    isLoading.value = !isLoading.value
    if (isLoading.value) {
        gameStore.socket.emit('newJoinQueue', {
            classic: useClassicMode
        });
    } else {
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

gameStore.socket.on('connect', () => {
  console.log(`Connected to server with ID ${gameStore.socket.id}`);
});

gameStore.socket.on('matchFound', (opponentId: string) => {
  console.log(`Match found with opponent ${opponentId}`);
  // Load the game view and pass in the opponent ID
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
