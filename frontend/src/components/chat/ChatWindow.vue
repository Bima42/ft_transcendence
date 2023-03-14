<template>
	  <div class="chat-window-wrapper">
		<MessageDisplay v-for="element in messages" :message="element"></MessageDisplay>
	  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'
import {get} from "../../../utils"
import MessageDisplay from "@/components/chat/MessageDisplay.vue";

const props = defineProps<{}>()


const messages = await get('chat/rooms/1/messages', 'Failed to get messages')
	.then((res) => res.json())
	.catch((err) => (console.log("Error: " + err)));

console.log("Messages: "  + JSON.stringify(messages));

</script>

<style scoped lang="scss">
.chat-window-wrapper {
  flex-grow: 1;
  width: 100%;
  height: 80%;
  position: relative;

  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
  gap: 15px;
}
</style>
