<template>
  <section class="message-wrapper" :class="textPosition">
    <UserAvatar type="small"></UserAvatar>
    <p>
      {{ props.message.content }}
    </p>
  </section>
</template>

<script setup lang="ts">
import {defineProps, computed} from 'vue'
import UserAvatar from "@/components/multiusage/UserAvatar.vue";
import { useUserStore } from "@/stores/user"
import type IChatMessage from '@/interfaces/chat/IChatMessage';

const authStore = useUserStore()
const props = defineProps<{
  message: IChatMessage,
}>()

let text_position = props.message.userId as number;

const textPosition = computed(() => {
  return text_position === authStore.user.id ? 'right' : 'left'
})
</script>

<style scoped lang="scss">
.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin: 5px;

  p {
    padding: 10px;
    border: 1px solid pink;
    max-width: 70%;
    overflow-wrap: break-word;
    height: 100%;
    text-align: left;
  }

  &.right {
    flex-direction: row-reverse;
    justify-content: flex-start;

    p {
      border-radius: 20px 20px 0px 20px;
    }
  }

  &.left {
    flex-direction: row;
    justify-content: flex-start;

    p {
      border-radius: 20px 20px 20px 0px;
    }
  }
}
</style>
