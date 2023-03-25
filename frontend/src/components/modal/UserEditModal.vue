<template>
  <section class="left-wrap">
    <UserAvatar type="big"/>
    <input type="text" placeholder="Username"/>
    <div class="two-fa">
      <h3>Enable 2FA</h3>
      <input type="checkbox" v-model="enableTwoFa" @change="toggleTwoFaStatus"/>
      <button @click="generateQrCode">Generate QR Code</button>
      <img v-if="qrCodeImage" :src="qrCodeImage" alt="QR Code"/>
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
import { post } from '../../../utils';

const modalStore = useModalStore()
const data = modalStore.data.data

const userStore = useUserStore()
const enableTwoFa = ref(userStore.user!.twoFA)
const qrCodeImage = ref('')

const toggleTwoFaStatus = () => {
  userStore.updateTwoFaStatus(enableTwoFa.value)
}

const generateQrCode = () => {
  post('auth/2fa/generate', 'Impossible to generate QR code: Please try again later')
    .then(response => response.json())
    .then(data => {
      qrCodeImage.value = data.qrCodeImage
    })
    .catch(err => console.log(err))
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