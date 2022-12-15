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
    color: yellow;
  }
}
</style>