<template>
  <p :class="textPosition">{{ props.message.content }}</p>
</template>

<script setup lang="ts">
import {defineProps, computed} from 'vue'

const props = defineProps<{
  message: object,
}>()

let text_position = props.message.sender as String

const textPosition = computed(() => {
  return text_position === 'Sandrine' ? 'right' : 'left'
  //replace 'Sandrine by currentUser
})
</script>

<style scoped lang="scss">
p {
  padding: 10px;
  border: 1px solid pink;
}

.right {
  background: #e601c0;
  border-radius: 20px;
}

.left {
  background: blue;
  border-radius: 20px;
}
</style>