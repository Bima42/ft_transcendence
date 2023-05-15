<template>
    <div class="chat-input-container">
        <input v-model="msgContent" type="text" placeholder="Type a message..." v-on:keyup.enter="sendMessage">
        <ButtonCustom
            @click="sendMessage"
            :style="'small'"
        >
            <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </ButtonCustom>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const msgContent = ref('');
const chatStore = useChatStore();
const userStore = useUserStore();

async function sendMessage() {
    const msg = msgContent.value.trim();
    if (!chatStore.currentChat || msg == '') return;
    const sentMsg = {
        content: msgContent.value,
        senderId: userStore.user?.id,
        chatId: chatStore.currentChat.id,
    };
    chatStore.sendMessage(sentMsg);
    msgContent.value = '';
}
</script>

<style scoped lang="scss">
.chat-input-container {
    display: flex;
    align-items: center;
    width: 100%;
    gap: $small_gap;
    padding-left: 10px;
    position: relative;

    input {
        flex: 1;
        height: 30px;
        border: 1px solid $tertiary;
        background-color: rgb(49, 49, 47);
        border-radius: 5px;
        padding: 0 10px;
        margin-right: 5px;
        color: white;
    }
}
</style>
