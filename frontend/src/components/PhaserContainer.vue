<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type IGame from '@/interfaces/game/IGame';

let gameInstance = null
const containerId = 'gameContainer'
const game = await import(/* webpackChunkName: "game" */ '@/game/game')

const props = defineProps<{
  currentGame: IGame,
}>();

onMounted(() => {
  gameInstance = game.launch(containerId, props.currentGame);
})

onUnmounted(() => {
  gameInstance.destroy(false)
})
</script>

<template>
    <div :id="containerId"></div>
</template>

<style scoped lang="scss">
    .containerId {
   width:500px; /* or whatever width you want. */
   max-width:500px;
    }
</style>
