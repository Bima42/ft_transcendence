<template>
  <p @click="$emit('setActive')" :class="getClassNames()"> <!-- Added :class binding to add dynamic class names based on the user's role -->
      {{ userChat.user.username }}
      <div class="user-details-background" v-show="isActive" @click.stop="$emit('setInactive')"></div>
      <div class="user-details-panel" v-show="isActive">
        <XButton :size="'small'" class="exit-button" @click.stop="$emit('setInactive')"/>
        <UserDetailsCardContent :userChat="props.userChat"></UserDetailsCardContent>
      </div>
  </p>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onUpdated } from 'vue'
import XButton from '@/components/XButton.vue'
import UserDetailsCardContent from '@/components/chat/UserDetailsCardContent.vue'
import type IUserChat from '@/interfaces/user/IUserChat';

defineEmits(['setActive', 'setInactive'])
const props = defineProps<{
  userChat: IUserChat,
  isActive: boolean,
}>()

const getClassNames = () => {
  return props.userChat.role.toLowerCase();
}

onUpdated(() => {
});
</script>

<style scoped lang="scss">
p {
  cursor: pointer;
  text-align: left;
  color: white;

  &.member { /* Added style for admin class */
    color: white;
  }
  &.admin { /* Added style for admin class */
    color: green;
  }

  &.banned { /* Added style for banned class */
    color: red;
  }

  &.owner { /* Added style for owner class */
    color: blue;
  }

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
