<template>
	  <div class="chat-window-wrapper">
		<MessageDisplay v-for="element in messages" :message="element"></MessageDisplay>
	  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'
import {get} from "../../../utils"
import MessageDisplay from "@/components/chat/MessageDisplay.vue";
import { useChatStore } from '@/stores/chat';

const props = defineProps<{}>()
const chatStore = useChatStore();
let messages: any;

chatStore.$subscribe((mutation, state) => {
    messages = state

});

messages = await get('chat/rooms/1/messages', 'Failed to get messages')
	.then((res) => res.json())
	.catch((err) => (console.log("Error: " + err)));
//	messages = [{content: "hallo", user: {username:"trossel"}}]

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
