<template>
  <HeaderTitle></HeaderTitle>
  <BurgerMenu></BurgerMenu>
</template>

<script setup lang="ts">
const props = defineProps<{}>()

import BurgerMenu from "@/components/headers/BurgerMenu.vue";
import HeaderTitle from "@/components/headers/HeaderTitle.vue";
</script>

<style scoped lang="scss">

</style>