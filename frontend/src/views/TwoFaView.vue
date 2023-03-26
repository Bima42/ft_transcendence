<template>
  <section class="otp-wrapper">
    <img alt="42 logo" style="width: 200px; height: 200px" src="@/assets/logo.png">
    <div class="code-container">
      <h4>Enter your code here</h4>
      <input type="text" placeholder="Enter your code here" v-model="code">
      <button @click="toggleCode">Submit</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const code = ref('')
const userStore = useUserStore()

const toggleCode = () => {
  userStore.verifyTwoFaCode(code.value)
}

</script>

<style scoped>

</style>