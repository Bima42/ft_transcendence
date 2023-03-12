<template>
  <section class="header-title-wrap">
    <img src="@/assets/img/logo.svg" @click="indexClick"/>
    <h1>FT_TRANSCENDENCE</h1>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{}>()

import { useRouter } from 'vue-router'

const router = useRouter()

function indexClick(e: Event) {
  router.push('/index')
}
</script>

<style scoped lang="scss">
.header-title-wrap {
  grid-area: $header1-2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  padding: 10px;
  width: 100%;

  h1 {
    font-size: 24px;
    font-family: "Meta", sans-serif;
  }

  img:hover {
    transition: all 1s ease-in-out;
    transform: rotate(360deg);
    cursor: pointer;
  }
}
</style>