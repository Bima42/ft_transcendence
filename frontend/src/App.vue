<template>
  <section class="UI-grid">
    <template v-if="route.name !== 'home'">
      <HeaderPack></HeaderPack>
      <MainMenu></MainMenu>
    </template>
    <CreditLink></CreditLink>
    <TheModal v-if="modalStore.show">
      <Component :is="modalStore.component"/>
    </TheModal>
    <router-view></router-view>
  </section>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'

import HeaderPack from "@/components/headers/HeaderPack.vue";
import CreditLink from "@/components/footers/CreditLink.vue";
import MainMenu from "@/components/MainMenu.vue";
import TheModal from "@/components/modal/TheModal.vue";
import {useModalStore} from "@/stores/modal";

const route = useRoute()
const modalStore = useModalStore()
</script>

<style lang="scss">
#app {
  font-family: "Meta", sans-serif;
  display: flex;
  width: 100vw;
  height: 100vh;
  font-weight: normal;
  background: $light-gray;
  color: white;

  .UI-grid {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 20% 30% 30% 20%;
    grid-template-rows: 10% 30% 30% 20% 10%;
    justify-items: center;
    align-items: center;

    grid-template-areas:
      "header1 header1 header2 header3"
      "left1 main1 main1 right1"
      "left1 main2 main2 right1"
      "left1 main3 main3 right1"
      "footer1 footer1 footer1 footer2";
  }
}
</style>
