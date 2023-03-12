<template>
  <section class="login-wrapper">
    <img alt="42 logo" style="width: 200px; height: 200px" src="@/assets/logo.png">
    <div class="buttons-container">
      <CustomButton styles="fat">Login with 42</CustomButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
import {useRouter} from 'vue-router'

const router = useRouter()
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
