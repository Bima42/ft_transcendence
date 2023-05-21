<template>
	<div :id="containerId"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

let gameInstance: Phaser.Game | null = null
const containerId = 'gameContainer'
const game = await import(/* webpackChunkName: "game" */ '@/game/game')
const router = useRouter()

onMounted(async () => {
	gameInstance = await game.launch(containerId, router);
})

onUnmounted(() => {
	gameInstance?.destroy(false)
})
</script>

<style scoped lang="scss">
#gameContainer {
	width: 100%;
	/* or whatever width you want. */
}
</style>
