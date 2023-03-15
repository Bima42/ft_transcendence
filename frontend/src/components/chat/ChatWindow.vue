<template>
	  <div class="chat-window-wrapper">
		<MessageDisplay v-for="element in messages" :message="element"></MessageDisplay>
	  </div>
</template>

<script setup lang="ts">
import {defineProps, ref, onMounted} from 'vue'
import {get} from "../../../utils"
import MessageDisplay from "@/components/chat/MessageDisplay.vue";
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import { useChatStore } from '@/stores/chat';

const props = defineProps<{}>()
const chatStore = useChatStore();
let messages = ref<IChatMessage[]>([]);

onMounted(() => {
    chatStore.$subscribe(async (mutation, state) => {
        const url = 'chat/rooms/' + chatStore.currentChat.id + "/messages";

        const tmp_messages = await get(url, 'Failed to get messages')
            .then((res) => res.json())
            .catch((err) => (console.log("Error: " + err)));

        messages.value = tmp_messages;
    });
});

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
