<template>
  <section class="header1">Je serai un header une jour :D</section>
  <section class="header2">menu</section>
  <section class="left">left !</section>
  <section class="main"><img src="src/assets/logo.png"/></section>
  <section class="right">right !</section>
  <section class="footer1">Information dans le footer !</section>
  <section class="footer2">credits ?</section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.header1 {
  grid-area: $header1-2;
}
.header2 {
  grid-area: header3;
}
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