<template>
  <div class="aled"></div>
</template>

<script setup lang="ts">
import { useModalStore } from "@/stores/modal"

const modalStore = useModalStore()

const data = modalStore.data.data
const model = modalStore.data.model
</script>

<style scoped lang="scss">
.aled {
  width: 400px;
  height: 400px;
  background: #e601c0;
}
</style>