<template>
  <p @click="$emit('setActive')">
    {{ user.name }}
  <div class="user-details-panel" v-show="isActive">
    Actif
    <button @click.stop="$emit('setInactive')">close</button>
  </div>
  </p>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

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

  .user-details-panel {
    width: 120px;
    padding: 30px;
    border-radius: 10px;
    border: 5px solid yellow;
    background: white;
    color: black;
    position: absolute;
    z-index: 10;
  }
}
</style>