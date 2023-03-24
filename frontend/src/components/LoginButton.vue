<template>
  <button :class="props.styles" @click="login">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/auth';

const userStore = useUserStore()

const props = defineProps<{
  styles?: String,
}>()

async function login() {
  userStore.redirect()
}
</script>

<style scoped lang="scss">
button {
  border-radius: 16px;
  background: $yellow;
  border: none;

  &:hover {
    cursor: pointer;
    filter: hue-rotate(180deg);
  }

  &.fat {
    font-weight: 900;
  }
}
</style>