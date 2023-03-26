<template>
    <div class="chat-input-container">
        <input v-model="msgContent" type="text" placeholder="Type a message..." v-on:keyup.enter="sendMessage">
        <CustomButton @click="sendMessage"><font-awesome-icon icon="fa-solid fa-paper-plane" /></CustomButton>
        <ChatCommandHelper/>
    </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/multiusage/CustomButton.vue';
import {post} from '../../../utils';
import {ref} from 'vue'
import {useChatStore} from '@/stores/chat';
import {useAuthStore} from '@/stores/auth';
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import ChatCommandHelper from '@/components/chat/chatcommands/ChatCommandHelper.vue';

const msgContent = ref('');
const chatStore = useChatStore();
const userStore = useAuthStore();

async function sendMessage() {
    if (msgContent.value.trim() == '') return;

    // Format: NewMessageDto from back
    const msg = {
        content: msgContent.value,
        senderId: userStore.user?.id,
        chatId: chatStore.currentChat.id,
    };

    chatStore.sendMessage(msg);
    msgContent.value = '';
}
</script>

<style scoped lang="scss">
.chat-input-container {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
    padding-left: 10px;
    position: relative;

    input {
        flex: 1;
        height: 30px;
        border: 1px solid yellow;
        background-color: rgb(49, 49, 47);
        border-radius: 5px;
        padding: 0 10px;
        margin-right: 5px;
        color: white;
    }
}
</style>
