<template>
  <router-link to="/index">
    <img alt="42 logo" style="width: 200px; height: 200px" src="./assets/logo.png">
  </router-link>
  <router-view></router-view>
</template>

<script setup lang="ts">

</script>

<style>
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  font-weight: normal;
  background: black;
  color: white;
}
</style>
