<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let gameInstance: Phaser.Game | null = null
const containerId = 'gameContainer'
const game = await import(/* webpackChunkName: "game" */ '@/game/game')

onMounted(async () => {
  gameInstance = await game.launch(containerId);
})

onUnmounted(() => {
  gameInstance?.destroy(false)
})
</script>

<template>
    <div :id="containerId"></div>
</template>

<style scoped lang="scss">
    #gameContainer {
   width:100%; /* or whatever width you want. */
    }
</style>
