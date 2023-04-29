<template>
    <div class="content_element" v-for="chatRoom in currentChatList" :id="chatRoom.id"
         @click="toggleChat(chatRoom.id)">
        <h1>Chats {{ chatRoom.name }}</h1>
        <font-awesome-icon icon="fa-chevron-right"/>
    </div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to send to the parent the clicked chat id
 *
 * @param {Function} toggleChat - This function is used to send the clicked chat id to the parent
 */
import { defineProps, ref, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import type IChat from '@/interfaces/chat/IChat'

const error = ref(null);
const chatStore = useChatStore();
const currentChatList = ref<IChat[]>()
let publicChatList = await chatStore.retrievePublicChats();
let privateChatList = await chatStore.retrieveWhispers();

const props = defineProps<{
    selectedChatList: string
}>()

const getCurrentList = (): IChat[] => {
    if (props.selectedChatList === 'public')
        return publicChatList
    else if (props.selectedChatList === 'private')
        return privateChatList
    else
        return []
}

const toggleChat = (id: number) => {
    const castedId = id.toString()
    if (!chatStore.setCurrentChat(castedId)) {
        console.error('Chat not found') //TODO: set variable and display error message
        return
    }
}

watch(props, () => {
    currentChatList.value = getCurrentList()
})

// Call it when loading the page
onMounted(async () => {
    publicChatList = await chatStore.retrievePublicChats()
    privateChatList = await chatStore.retrieveWhispers()
    currentChatList.value = getCurrentList()
});
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