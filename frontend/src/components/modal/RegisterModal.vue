<template>
  <form>
    <h1>Create a new account</h1>
    <li>
      <label for="username">Username</label>
      <input type="text" id="username" placeholder="Your username..." v-model="username">
    </li>
    <li>
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Your email..." v-model="email">
    </li>
    <li>
      <label for="phone">Phone number</label>
      <input type="text" id="phone" placeholder="Your phone number...">
    </li>
    <li>
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Your password..." v-model="password">
    </li>
    <li>
      <label for="password2">Confirm password</label>
      <input type="password" id="password2" placeholder="Confirm your password..." v-model="password2">
    </li>
  </form>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

const props = defineProps<{}>()
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