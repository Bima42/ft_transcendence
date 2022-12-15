<template>
  <section class="footer-credit-wrap">
    <router-link to="/credits">Credits</router-link>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.footer-credit-wrap {
  grid-area: footer2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  a {
    font-family: "Meta", sans-serif;
    font-variation-settings: "wght" 1900, "ital" 0;
    text-shadow: none;
    -webkit-text-stroke: 2px $yellow;
    letter-spacing: 2px;
    font-size: 18px;
    color: black;
  }
}
</style>