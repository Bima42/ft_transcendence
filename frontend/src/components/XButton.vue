<template>
  <button :class="props.size"><span class="cross"></span></button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  size: string,
}>()
</script>

<style lang="scss" scoped>
button {
  border: none;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: $yellow;
  border-radius: 50%;
  margin-left: 83.4px;
  font-size: 28pt;
  transition: all 200ms ease-in-out;

  &.big {
    width: 60px;
    height: 60px;

    .cross::before,
    .cross::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 4px;
      background: black;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(255, 101, 47, .2);
      transition: all .5s ease-in-out;
    }

    .cross::before {
      transform: rotate(-45deg) translate(-10px, -10px);
    }

    .cross::after {
      transform: rotate(45deg) translate(-10px, 10px);
    }
  }

  &.small {
    width: 30px;
    height: 30px;

    .cross::before,
    .cross::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 3px;
      background: black;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(255, 101, 47, .2);
      transition: all .5s ease-in-out;
    }

    .cross::before {
      transform: rotate(-45deg) translate(-6px, -8px);
    }

    .cross::after {
      transform: rotate(45deg) translate(-8px, 6px);
    }
  }

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
    transition: all 200ms ease-in-out;
  }
}
</style>