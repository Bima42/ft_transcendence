<template>
  <div class="chat-window-wrapper">
    <MessageDisplay v-for="element in messages" :message="element"></MessageDisplay>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'
import MessageDisplay from "@/components/chat/MessageDisplay.vue";

const props = defineProps<{}>()

const messages = ref(
    [
      {
        content: 'Bima',
        sender: 'Yvan',
      },
      {
        content: 'Mabi',
        sender: 'Bima',
      },
      {
        content: 'Te',
        sender: 'Sandrine',
      },
      {
        content: 'Teasdadasdasdfafa gfwg wrg asdfg asdf gsdfg dfg dfg dfg dfg dfg dfg dfg',
        sender: 'Sandrine',
      },
      {
        content: 'Teeasdadasdasdfafa gfwg wrg asdfg asdf gsdfg dfg dfg dfgeasdadasdasdfafa gfwg wrg asdfg asdf gsdfg dfg dfg dfgeasdadasdasdfafa gfwg wrg asdfg asdf gsdfg dfg dfg dfg',
        sender: 'Sandrine',
      },
      {
        content: 'Te',
        sender: 'Yvan',
      },
    ]
)
</script>

<style scoped lang="scss">
.chat-window-wrapper {
  flex-grow: 1;
  width: 100%;
  height: 80%;

  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
}
</style>