<template>
  <button :class="props.styles" @click="login">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const userStore = useAuthStore()

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
  padding: 5px 12px;
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