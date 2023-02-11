<template>
  <p @click="$emit('setActive')">
      {{ user.name }}
  <div class="user-details-background" v-show="isActive" @click.stop="$emit('setInactive')"></div>
    <div class="user-details-panel" v-show="isActive" @click="clickOutside">
      <XButton :size="'small'" class="exit-button" @click.stop="$emit('setInactive')"/>
      <UserDetailsCardContent></UserDetailsCardContent>
    </div>
  </p>
</template>

<script setup lang="ts">
import {defineProps, defineEmits } from 'vue'
import XButton from '@/components/XButton.vue'
import UserDetailsCardContent from '@/components/chat/UserDetailsCardContent.vue'

defineEmits(['setActive', 'setInactive'])
const props = defineProps<{
  user: object,
  isActive: boolean,
}>()
</script>

<style scoped lang="scss">
p {
  cursor: pointer;
  text-align: left;
  color: white;

  .user-details-background {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: none;
    z-index: 1000;
  }

  .user-details-panel {
    width: 350px;
    height: 125px;
    border: 2px solid $yellow;
    background: $light-gray;
    position: absolute;
    z-index: 1001;

    .exit-button {
      position: absolute;
      z-index: 10;
      top: 5px;
      right: 5px;
    }
  }
}
</style>