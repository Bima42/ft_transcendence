<template>
  <section class="gamePong">
    <Suspense>
      <PhaserContainer :current-game="currentGame"/>

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
import { useGameStore } from '@/stores/game';
import { ref } from 'vue';
import type IGame from '@/interfaces/game/IGame';

const gameStore = useGameStore();

const currentGame = ref<IGame>(gameStore.currentGame);
</script>

<style scoped lang="scss">
.gamePong {
  grid-area: $main;
}
</style>
