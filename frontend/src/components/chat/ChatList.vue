<template>
    <div class="content_element"
         v-for="chatRoom in (props.selectedChatList === 'public' ? chatStore.subscribedChannelsList : chatStore.whisperChatList)"
         :id="chatRoom.id.toString()" :key="chatRoom.id"
         @click="toggleChat(chatRoom.id)">
        <h1>{{ chatRoom.name }}</h1>
        <font-awesome-icon icon="fa-chevron-right"/>
    </div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to send to the parent the clicked chat id
 *
 * @param {Function} toggleChat - This function is used to send the clicked chat id to the parent
 */
import { defineProps } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore();
await chatStore.updateStore();

const props = defineProps<{
    selectedChatList: string
}>()

const toggleChat = async (id: number) => {
    const castedId = id.toString()
    const response = chatStore.setCurrentChat(castedId)
    if (!response) {
        console.error('Chat not found') //TODO: set variable and display error message
        return
    }
}
</script>

<style scoped lang="scss">
.content_element {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $tertiary;
    border-top: 1px solid $tertiary;
    background-color: $secondary;
    padding: 30px;

    &:hover {
        cursor: pointer;
    }
}
</style>
