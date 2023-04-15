<template>
    <div class="content_element" v-for="chatRoom in currentChatList" :id="chatRoom.id"
         @click="toggleChat(chatRoom.id, chatRoom.name)">
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
import { defineProps, ref, onMounted, onUpdated } from 'vue'
import { get } from '../../../../utils'
import { useChatStore } from '@/stores/chat'

const publicChatList = ref([]);
const privateChatList = ref([]);
const error = ref(null);
const chatStore = useChatStore();
const currentChatList = ref([])

const props = defineProps<{
    toggleChat: (id: number) => void
    selectedChatList: string
}>()

const getCurrentList = () => {
    if (props.selectedChatList === 'public')
        return publicChatList.value
    else if (props.selectedChatList === 'private')
        return privateChatList.value
    else
        return []
}

const toggleChat = (id: number, name: string) => {
    props.toggleChat(id, name)
}

let currentChatName = chatStore.currentChat ? ref(chatStore.currentChat.name) : ref("Chat name");

chatStore.$subscribe((mutation, state) => {
    if (chatStore.currentChat)
        currentChatName.value = chatStore.currentChat.name;
})

async function retrievePublicChats() {
    await get('chat/rooms', 'Failed to retrieve chat list')
        .then((res) => res.json())
        .then((json) => {
            publicChatList.value = json;
        })
        .catch((err) => (error.value = err));

}

onUpdated(() => {
    currentChatList.value = getCurrentList()
})

// Call it when loading the page
onMounted(async () => {
    await retrievePublicChats();
    retrieveWhispers();
    currentChatList.value = getCurrentList()
});

function retrieveWhispers() {
    get('chat/rooms?whispers=true', 'Failed to retrieve whispers list')
        .then((res) => res.json())
        .then((json) => (privateChatList.value = json))
        .catch((err) => (error.value = err));
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