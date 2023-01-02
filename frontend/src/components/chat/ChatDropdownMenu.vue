<template>
  <section class="menu-wrapper">
    <p>{{ props.name + " V"}}</p>
  </section>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

const props = defineProps<{
  name: String,
  chatList: object,
}>()
</script>

<style scoped lang="scss">
.menu-wrapper {
  width: 15%;
  justify-self: center;
  align-self: center;
  border: 2px solid $yellow;
  border-radius: 20px;
  padding: 5px;

  &:hover {
    background: pink;
  }

  p {
    text-align: center;
    cursor: pointer;
  }
}

</style>