<template>

    <div id="wrapper">

        <GameSettings @joinCustom="onJoinCustom" @joinClassic="onJoinClassic"/>
        <CustomButton id="join_btn" @click="joinQueue">
            {{ isLoading ? 'Abort' : 'Join queue' }}
        </CustomButton>
        <LoadingGame v-if="isLoading"></LoadingGame>
        <button id="validateBtn">Validate</button>

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
var useClassicMode = true;
const socket = io();

// Emit the 'join-queue' event when the user clicks a button to join the queue
joinQueueBtn.addEventListener('click', () => {
  const gameSettings = {
    classic: true, // or false for custom games
    // other game settings
  };
  socket.emit('join-queue', gameSettings);
});

// Listen for the 'match-found' event
socket.on('match-found', (matchId) => {
  // Display a message to the user indicating that a match has been found
  messageDiv.textContent = `Match found! Match ID: ${matchId}. Click the "validate" button to start the game.`;

  // Enable the "validate" button
  validateBtn.disabled = false;

  // Listen for the 'validate' event
  validateBtn.addEventListener('click', () => {
    // Emit the 'validate' event to the server
    socket.emit('validate');
  });
});

function joinQueue() {
    isLoading.value = !isLoading.value
    if (isLoading.value) {
        gameStore.socket.emit('newJoinQueue', {
            classic: useClassicMode
        }, (response) => { console.log(response)});
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
  isLoading.value = false;
  // Redirect the user to the game page with the opponent ID
  router.push(`/game/${opponentId}`);
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
