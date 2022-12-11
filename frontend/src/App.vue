<template>
  <section class="UI-grid">
    <router-view></router-view>
  </section>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  font-weight: normal;
  background: black;
  color: white;

  .UI-grid {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 20% 30% 30% 20%;
    grid-template-rows: 10% 30% 30% 20% 10%;

    grid-template-areas:
      "header1 header1 header2 header3"
      "left main1 main1 right"
      "left main2 main2 right"
      "left main3 main3 right"
      "footer1 footer1 footer1 footer2";
  }
}
</style>
