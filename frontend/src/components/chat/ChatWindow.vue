<template>
    <div class="chat-window-wrapper">
        <h1 id="background_text">No messages :(</h1>
        <MessageDisplay v-for="element in messages" :message="element"></MessageDisplay>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { get } from "../../../utils"
import MessageDisplay from "@/components/chat/MessageDisplay.vue";
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import { useChatStore } from '@/stores/chat';
import type IChat from '@/interfaces/chat/IChat';

const chatStore = useChatStore();
let messages = ref<IChatMessage[]>([]);

chatStore.socket.on('msg', (data: IChatMessage) => {
    messages.value.unshift(data);
    (document.getElementById("background_text") as HTMLElement).style.display = "none";
});

async function updateMessages(chat: IChat) {
    if (!chat)
        return;
    const url = 'chat/rooms/' + chat.id + "/messages";
    messages.value = await get(url, 'Failed to get messages')
        .then((res) => res.json())
        .catch((err) => {
            console.error(err)
            return [];
        });
    if (messages.value.length > 0) {
        (document.getElementById("background_text") as HTMLElement).style.display = "none";
    } else {
        (document.getElementById("background_text") as HTMLElement).style.display = "block";
        (document.getElementById("background_text") as HTMLElement).textContent = "No messages";
    }
}
// Reload from server. TODO: from localStorage ?
updateMessages(chatStore.currentChat);

chatStore.$onAction((context) => {
    if (context.name == "setCurrentChat") {
        messages.value = [];
        (document.getElementById("background_text") as HTMLElement).style.display = "block";
        (document.getElementById("background_text") as HTMLElement).textContent = "Loading...";
    }
    context.after((result: IChat) => {
        if (context.name == "setCurrentChat") {
            updateMessages(result);
        }
    })
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
