<template>
    <div class="chat-window-wrapper">
        <h1 id="background_text">No messages :(</h1>
        <MessageDisplay v-for="element in messages" :message="element"></MessageDisplay>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import { get } from "../../../utils"
import MessageDisplay from "@/components/chat/MessageDisplay.vue";
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import { useChatStore } from '@/stores/chat';

const props = defineProps<{}>()
const chatStore = useChatStore();
let messages = ref<IChatMessage[]>([]);

onMounted(() => {
    chatStore.$subscribe(async (mutation, state) => {
        const url = 'chat/rooms/' + chatStore.currentChat.id + "/messages";

        messages.value = [];
        const tmp_messages = await get(url, 'Failed to get messages')
            .then((res) => res.json())
            .catch((err) => (console.log("Error: " + err)));

        messages.value = tmp_messages;
        console.log("count = " + messages.value.length);
        if (messages.value.length)
            document.getElementById("background_text").style.display = "none";
        else
            document.getElementById("background_text").style.display = "block";

    });
});

</script>


<style scoped lang="scss">
#background_text {
    width: 100%;
    height: 80%;
    text-align: center;

}

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
