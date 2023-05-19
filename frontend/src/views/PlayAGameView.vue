<template>
  <section class="gamePong">
    <Suspense>
      <PhaserContainer/>
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
import { useNotificationStore } from '@/stores/notification';
import { onUnmounted } from 'vue';

const notificationStore = useNotificationStore()
notificationStore.show = false

onUnmounted(() => {
  notificationStore.show = true
})
</script>

<style scoped lang="scss">
.gamePong {
  grid-area: $gigamain;
  width: 100%;
  height: 100%;
}
</style>
