<template>
  <form>
    <h1>Create a new account</h1>
    <li>
      <label for="username">Username</label>
      <input type="text" id="username" name="username" placeholder="Your username..." v-model="username" required>
    </li>
    <li>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Your email..." v-model="email" required>
    </li>
    <li>
      <label for="phone">Phone number</label>
      <input type="text" id="phone" name="phone" placeholder="Your phone number..." v-model="phone" required>
    </li>
    <li>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Your password..." v-model="password" required>
    </li>
    <li>
      <label for="password2">Confirm password</label>
      <input type="password" id="password2" placeholder="Confirm your password...">
    </li>
    <CustomButton styles="fat" @click="registerClick">Register</CustomButton>
  </form>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'
import CustomButton from '@/components/multiusage/CustomButton.vue'
import {useRouter} from "vue-router";
const router = useRouter()

const props = defineProps<{}>()

const username = ref("")
const password = ref("")
const email = ref("")
const phone = ref("")

function registerClick (e: MouseEvent) {
  if (e.target instanceof HTMLButtonElement && e.target.innerText === 'Register') {
    fetch(`http://${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        phone: phone.value
      })
    })
        .catch((error) => {
          console.error(error);
        });
  }
}
</script>

<style scoped lang="scss">

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
  box-sizing: border-box;
  gap: 20px;

  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: $yellow;
    text-align: center;
    margin: 30px;
  }

  li {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}

</style>
