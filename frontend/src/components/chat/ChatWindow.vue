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
import type IChat from '@/interfaces/chat/IChat';

const props = defineProps<{}>()
const chatStore = useChatStore();
const hello: string = "Hello";
let messages = ref<IChatMessage[]>([]);

chatStore.socket.on('msg', (data: IChatMessage) => {
    console.log("Received new msg:" + JSON.stringify(data));
    messages.value.unshift(data);
    (document.getElementById("background_text") as HTMLElement).style.display = "none";
});

onMounted(() => {
    chatStore.$onAction((context) => {
        // this will trigger if the action succeeds and after it has fully run.
        // it waits for any returned promised
        context.after(async (result: IChat) => {
            if (context.name == "setCurrentChat") {

                messages.value = [];
                const url = 'chat/rooms/' + result.id + "/messages";
                const tmp_messages = await get(url, 'Failed to get messages')
                    .then((res) => res.json())
                    .catch((err) => (console.log("Error: " + err)));

                messages.value = tmp_messages;
                const displayValue = messages.value.length ? "none" : "block";
                (document.getElementById("background_text") as HTMLElement).style.display = displayValue;
            }
        })
    });
});
//    })
//});

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
