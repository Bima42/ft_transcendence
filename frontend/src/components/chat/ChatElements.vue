<template>
    <div class="chat_element">
        <ChatMessage
            v-if="chatStore.isChatOpen"
            v-for="message in chatStore.currentChat?.messages"
            :key="message.id"
            :author="message.author"
            :userIs="currentUser"
        >
            {{ message.content }}
        </ChatMessage>
    </div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to get the clicked chat ID and display the message according to the chat ID
 * received from the parent
 *
 * @param {number} chatId - This is the chat ID that is received from the parent
 */
import { onUnmounted, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useFriendStore } from '@/stores/friend'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import type IChatMessage from '@/interfaces/chat/IChatMessage'
import type IUser from '@/interfaces/user/IUser';

const userStore = useUserStore()
const chatStore = useChatStore()
const friendStore = useFriendStore()
const currentUser = userStore.user?.id

chatStore.getMessages().then(() => {
    chatStore.socket.on('msg', (data: IChatMessage) => {
        chatStore.onNewMessage(data)
    })}).catch((e) => {
    window.alert(e.message)
})

onUnmounted(() => {
    chatStore.socket.off('msg')
    chatStore.resetState()
})
</script>

<style scoped lang="scss">
.chat_element {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column-reverse;
    overflow-y: scroll;
    gap: $small_gap;
    padding: 15px;
}
</style>
