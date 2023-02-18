<template>
  <section class="login-wrapper">
    <img alt="42 logo" style="width: 200px; height: 200px" src="@/assets/logo.png">
    <form action="http://localhost:3080/auth/login" method="post" v-on:keyup.enter="login">
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="username" v-model="username" required>
      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password"
             name="password"
             v-model="password"
             required>
      <CustomButton styles="fat">Login</CustomButton>
    </form>
    <div class="buttons-container">
      <CustomButton styles="fat" @click="modalStore.loadAndDisplay(Modal, RegisterModal, {})">Register</CustomButton>
      <form action="http://localhost:3080/auth/42/callback" method="GET">
        <CustomButton styles="fat">Login with 42</CustomButton>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useModalStore} from '@/stores/modal'
import Modal from '@/components/modal/TheModal.vue'
import RegisterModal from '@/components/modal/RegisterModal.vue'

const router = useRouter()
const modalStore = useModalStore()

const username = ref("")
const password = ref("")
</script>

<style scoped lang="scss">
$button-gap: 10px;
.login-wrapper {
  grid-area: $main;

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}

.buttons-container {
  margin-top: $button-gap;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 10px;

  button {
    width: calc(50% - $button-gap / 2);
  }
}

</style>
