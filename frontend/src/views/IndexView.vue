<template>
  <HeaderPack></HeaderPack>
  <section class="left">left !</section>
  <section class="main"><img src="src/assets/logo.png"/></section>
  <section class="right">right !</section>
  <section class="footer1">Information dans le footer !</section>
  <router-link to="/credits">Credits</router-link>
</template>

<script setup lang="ts">
import HeaderPack from "@/components/headers/HeaderPack.vue";
</script>

<style scoped lang="scss">
.left {
  grid-area: left1;
}
.right {
  grid-area: right1;
}
.main {
  grid-area: $main;
  display: flex;
  justify-content: center;
  img {
    width: 75%;
  }
}
.footer1 {
  grid-area: footer1;
}
.footer2 {
  grid-area: footer2;
}

</style>