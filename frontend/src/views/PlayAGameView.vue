<template>
    <section class="gamePong">
	  <Suspense>
		<PhaserContainer />

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
</script>

<style scoped lang="scss">
    .gamePong {
        grid-area: $main;
    }
</style>
