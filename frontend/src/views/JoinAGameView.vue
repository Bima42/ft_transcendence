<template>
    <section class="select_game_mode_wrap">
        <h2>Select the game mode you wish to play</h2>
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
                Join the queue
            </ButtonCustom>
        </div>
        <div class="queue_wrapper" v-else>
            <h1>{{queueTimer}}s</h1>
            <img src="@/assets/img/loading.svg" alt="loading">
            <ButtonCustom @click="leaveQueue" :style="'big'">Leave Queue</ButtonCustom>
        </div>
    </section>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import {useGameStore} from '@/stores/game'
import {useRouter} from 'vue-router'
import type IGameSettings from '@/interfaces/game/IGameSettings'

const router = useRouter()

const gameStore = useGameStore();
const isLoading = ref(false);
const useClassicMode = ref(true);
const queueTimer = ref(0)
let queueTimerIntervalID = 0

function joinQueue() {
    isLoading.value = !isLoading.value
    // Joining queue !
    if (isLoading.value) {
        gameStore.socket.emit('newJoinQueue', {
            type: useClassicMode.value ? 'CLASSIC' : 'CUSTOM'
        });
        // This is ubercrade
        queueTimerIntervalID = setInterval(() => {
            queueTimer.value += 1
        }, 1000)
    }
    // Aborting queue
    else {
        leaveQueue()
    }
}

function leaveQueue() {
    isLoading.value = false
    gameStore.socket.emit('abortJoinQueue')
    queueTimer.value = 0
    clearInterval(queueTimerIntervalID)
}

function onJoinClassic() {
    useClassicMode.value = true;
}

function onJoinCustom() {
    useClassicMode.value = false;
}

// Listen for the 'match-found' event
gameStore.socket.once('matchFound', (gameSettings: IGameSettings) => {
    (document.getElementById('join_btn') as HTMLButtonElement).disabled = true;
    isLoading.value = false;
    // Redirect the user to the game page with the opponent ID
    router.push(`game`);
});

gameStore.socket.on('connect', () => {
    console.log(`Connected to server with ID ${gameStore.socket.id}`);
});

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
