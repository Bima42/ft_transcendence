<template>
  <p @click="$emit('setActive')">
    {{ user.name }}
  <div class="user-details-panel" v-show="isActive">
    <UserAvatar type="small"/>
    Actif
    <button @click.stop="$emit('setInactive')">close</button> <button v-on:click="addFriend">{{ buttonName }} </button> <button>Send private msg</button> <button @click="$emit('setActive')">...</button>
  </div>
  </p>
</template>

<script setup lang="ts">

var buttonName = "Add friend"

import {defineProps} from 'vue';
import UserAvatar from "@/components/UserAvatar.vue";

  function addFriend () {
    return {
      buttonName: "remove"
    }
  }

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
    width: 400px;
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