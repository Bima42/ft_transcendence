<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let gameInstance : Phaser.Game
const containerId = 'game-container'
const game = await import(/* webpackChunkName: "game" */ '@/game/game')

onMounted(() => {
  gameInstance = game.launch(containerId)
})

onUnmounted(() => {
  gameInstance.destroy(false)
})
</script>

<template>
    <div :id="containerId">
        <canvas id="mygamecanvas"></canvas>
    </div>
</template>

<style scoped lang="scss">
    .containerId {
   width:500px; /* or whatever width you want. */
   max-width:500px;
    }
</style>
