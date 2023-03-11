<template>
  <button :class="props.styles" @click="login">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import router from "@/router";

const props = defineProps<{
  styles?: String,
}>()

async function login() {
  const loginUrl = 'http://localhost:3080/users/login';
  const redirect = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-92ce1a0afad1a634dcd2140cbf1a6fe599e99cb72bd310a13428b5d8187ad240&redirect_uri=http%3A%2F%2Flocalhost%3A3080%2Fauth%2F42%2Fcallback&response_type=code';
  window.open(redirect, '_self');
  try {
    const response = await fetch(loginUrl, { method: 'GET', credentials: 'include' });
    if (response.status === 200) {
      router.push({ path: '/index' });
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped lang="scss">
button {
  border-radius: 16px;
  background: $yellow;
  padding: 5px 12px;
  border: none;

  &:hover {
    cursor: pointer;
    filter: hue-rotate(180deg);
  }

  &.fat {
    font-weight: 900;
  }
}
</style>