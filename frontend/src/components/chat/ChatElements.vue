<template>
    <div class="chat_element">
        <ChatMessage
            v-if="chatStore.isChatOpen"
            v-for="message in chatStore.currentChat.messages"
            :key="message.id"
            :sender="message.user"
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
import { onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const chatStore = useChatStore()
const currentUser = userStore.user?.id

onMounted(async () => {
    await chatStore.getMessages()
})

</script>

<style scoped lang="scss">
.chat_element {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column-reverse;
    overflow-y: scroll;
    gap: 10px;
    padding: 15px;
}
</style>
