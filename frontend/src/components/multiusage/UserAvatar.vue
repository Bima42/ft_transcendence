<template>
  <span class="avatar-container" :class="props.type">
    <img :src="imgUrl" alt="Oh no !"/>
  </span>
</template>

<script setup lang="ts">
import { ref, onUpdated } from 'vue';

const props = defineProps<{
  type: string,
  url: string | null,
}>()

const defaultUrl = `https://${import.meta.env.VITE_BACKEND_URL}/uploads/default.png`

let imgUrl = ref(props.url || defaultUrl)

onUpdated(() => {
    imgUrl.value = props.url || defaultUrl
})

</script>

<style lang="scss">
.avatar-container {
  display: block;
  content: "";
  border-radius: 50%;
  background-color: $yellow;
  overflow: hidden;
  border: 2px solid $yellow;
  box-sizing: content-box;

  &.big {
    width: 20vw;
    height: 20vw;

    img:hover {
      cursor: pointer;
      transition: all .1s ease-in-out;
      filter: blur(2px);
    }
  }

  &.small {
    width: 50px;
    height: 50px;
  }

  &.chat {
      width: 30px;
      height: 30px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
