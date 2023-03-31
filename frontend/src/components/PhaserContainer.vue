<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let gameInstance = null
const containerId = 'gameContainer'
const game = await import(/* webpackChunkName: "game" */ '@/game/game')

onMounted(() => {
  gameInstance = game.launch(containerId);
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
