<template>
  <section class="left-wrap">
    <UserAvatar type="big"/>
    <input type="text" placeholder="Username"/>
    <div class="two-fa">
      <h3>Enable 2FA</h3>
      <input type="checkbox" v-model="enableTwoFa" @change="toggleTwoFaStatus"/>
    </div>
  </section>
  <section class="right-wrap">
    <UserHighestScore></UserHighestScore>
  </section>
</template>

<script setup lang="ts">
import {useModalStore} from "@/stores/modal"
import {useUserStore} from "@/stores/auth"
import {ref} from "vue"
import UserAvatar from "@/components/UserAvatar.vue"
import UserHighestScore from "@/components/UserHighestScore.vue"

const modalStore = useModalStore()
const data = modalStore.data.data

const userStore = useUserStore()
const enableTwoFa = ref(userStore.user!.twoFA)

const toggleTwoFaStatus = () => {
  userStore.updateTwoFaStatus(enableTwoFa.value)
}
</script>

<style scoped lang="scss">
.left-wrap {
  display: flex;
  width: 50%;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;

  .two-fa {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
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