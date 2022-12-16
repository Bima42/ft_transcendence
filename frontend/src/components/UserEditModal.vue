<template>
  <section class="left-wrap">
    <UserAvatar type="big"/>
    <input type="text" placeholder="Username"/>
  </section>
  <section class="right-wrap">
    <UserHighestScore></UserHighestScore>
  </section>
</template>

<script setup lang="ts">
import {useModalStore} from "@/stores/modal"
import UserAvatar from "@/components/UserAvatar.vue";
import UserHighestScore from "@/components/UserHighestScore.vue";

const modalStore = useModalStore()

const data = modalStore.data.data
const model = modalStore.data.model
</script>

<style scoped lang="scss">
.left-wrap {
  display: flex;
  width: 50%;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}

.right-wrap {
  display: flex;
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>