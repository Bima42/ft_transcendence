<template>
    <section class="left-wrap">
        <UserAvatar type="big" :url="userStore.user?.avatar"/>
        <input type="file" accept="image/*" @change="uploadAvatar"/>
        <UsernameInput/>
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
import UsernameInput from '@/components/modal/useredit/UsernameInput.vue';
import UserAvatar from '@/components/multiusage/UserAvatar.vue';
import UserHighestScore from '@/components/modal/useredit/UserHighestScore.vue';
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { post } from '../../../../utils';

const userStore = useUserStore()
const enableTwoFa = ref(userStore.user!.twoFA)
const qrCodeImage = ref('')

const toggleTwoFaStatus = () => {
  userStore.updateTwoFaStatus(enableTwoFa.value)
}

const generateQrCode = () => {
  post('2fa/generate', 'Impossible to generate QR code: Please try again later')
      .then(response => response.json())
      .then(data => {
        qrCodeImage.value = data.qrCodeImage
      })
      .catch(err => console.log(err))
}

async function uploadAvatar(event: Event) {
  const file = (event.target as HTMLInputElement).files![0]

  const formData = new FormData()
  formData.append('avatar', file, file.name)
  userStore.uploadAvatar(formData)
}
</script>

<style scoped lang="scss">
.left-wrap {
    display: flex;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.right-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
}
</style>
