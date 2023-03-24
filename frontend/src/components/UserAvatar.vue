<template>
  <span class="avatar-container" :class="props.type">
    <img :src="userStore.user?.avatar"/>
  </span>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/auth';

const userStore = useUserStore()

const props = defineProps<{
  type: String,
}>()
</script>

<style lang="scss">
.avatar-container {
  display: block;
  content: "";
  border-radius: 50%;
  background-color: $yellow;
  overflow: hidden;
  border: 2px solid $yellow;
  box-sizing: content-box;

  &.big {
    width: 20vw;
    height: 20vw;

    img:hover {
      cursor: pointer;
      transition: all .1s ease-in-out;
      filter: blur(2px);
    }
  }

  &.small {
    width: 4vw;
    height: 4vw;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>