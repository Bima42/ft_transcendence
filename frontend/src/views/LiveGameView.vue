<template>
  <header-pack></header-pack>
  <MainMenu position="left"></MainMenu>
</template>

<script setup lang="ts">
import HeaderPack from "@/components/headers/HeaderPack.vue";
import MainMenu from "@/components/MainMenu.vue";

const props = defineProps<{}>()
</script>

<style scoped lang="scss">

</style>