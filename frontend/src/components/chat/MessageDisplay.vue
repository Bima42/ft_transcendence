<template>
  <section class="message-wrapper" :class="textPosition">
    <UserAvatar type="chat" :url="imgUrl"></UserAvatar>
    <p>
      {{ props.message.content }}
    </p>
  </section>
</template>

<script setup lang="ts">
import {defineProps, ref, computed, onUpdated} from 'vue'
import UserAvatar from "@/components/multiusage/UserAvatar.vue";
import { useUserStore } from "@/stores/user"
import type IChatMessage from '@/interfaces/chat/IChatMessage';

const authStore = useUserStore()
const props = defineProps<{
  message: IChatMessage,
}>()

let imgUrl = ref(props.message.user.avatar);

let text_position = ref(props.message.user.id as number);

onUpdated(() => {
    imgUrl.value = props.message.user.avatar;
    text_position.value = props.message.user.id as number;
})

const textPosition = computed(() => {
  return text_position.value === authStore.user?.id ? 'right' : 'left'
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
