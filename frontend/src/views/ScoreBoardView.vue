<template>
  <header-pack></header-pack>
  <MainMenu position="left"></MainMenu>
  <CreditLink></CreditLink>
</template>

<script setup lang="ts">
import HeaderPack from "@/components/headers/HeaderPack.vue";
import MainMenu from "@/components/MainMenu.vue";
import CreditLink from "@/components/footers/CreditLink.vue";

const props = defineProps<{}>()
</script>

<style scoped lang="scss">

</style>