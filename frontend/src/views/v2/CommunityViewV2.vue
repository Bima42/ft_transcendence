<template>
    <section class="community_wrapper">
        <section class="community_header">
            <font-awesome-icon v-if="chatIsOpen" icon="fa-chevron-left" @click="toggleChat(-1)"/>
            <h2
                v-if="!chatIsOpen"
                v-for="chat in chatListsSources"
                :key="chat.id"
                @click="selectChatList(chat.id)"
                :class="[selectedChatList === chat.id ? '' : 'not_selected']"
            >
                {{ chat.name }}
            </h2>
            <h2 v-else>
                {{ currentChatName }}
            </h2>
        </section>
        <div class="community_content">
            <template :class="[chatIsOpen ? 'hidden' : 'shown mtl']">
                <ChatList
                    :selectedChatList="selectedChatList"
                    :toggleChat="toggleChat"
                />
            </template>
            <template :class="['chat_wrap', chatIsOpen ? 'shown rtm' : 'hidden']">
                <ChatElements
                    :chatId="currentlyOpenChat"
                />
                <TypeBox/>
            </template>
        </div>
    </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import ChatList from '@/components/v2/chat/ChatList.vue'
import ChatElements from '@/components/v2/chat/ChatElements.vue'
import TypeBox from '@/components/chat/TypeBox.vue';

const props = defineProps<{}>()

const chatIsOpen = ref(false)
const currentlyOpenChat = ref(0)
const selectedChatList = ref('public')
const currentChatName = ref('')

const chatListsSources = ref({
    chat1: {
        name: 'Chat Rooms',
        id: 'public',
    },
    chat2: {
        name: 'Whispers',
        id: 'private',
    },
})
const selectChatList = (chatID: string) => {
    selectedChatList.value = chatID
}
const toggleChat = (id: number, name: string) => {
    if (id === -1) {
        chatIsOpen.value = !chatIsOpen.value
        currentlyOpenChat.value = -1
        currentChatName.value = ''
        return
    }
    currentChatName.value = name
    currentlyOpenChat.value = id
    chatIsOpen.value = !chatIsOpen.value
}
</script>

<style scoped lang="scss">
.community_wrapper {
    grid-area: $gigamain;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .community_header {
        border-bottom: 1px solid $tertiary;
        border-top: 1px solid $tertiary;
        padding: 10px;
        width: 100%;
        text-align: center;
        position: sticky;
        display: flex;
        justify-content: center;
        gap: 20px;
        color: $quaternary;

        .not_selected {
            transition: color 0.2s ease-in-out;
            color: $secondary;
        }

        svg {
            height: 50%;
            position: absolute;
            left: 10px;
            top: calc(50% - 10px);
        }
    }

    .community_content {
        height: 100%;
        width: 100%;
        overflow: auto;
    }
}

.hidden {
    display: none;
}

.shown {
    display: block;
    &.mtl {
        animation: fadeInMTL 0.2s ease-in-out;
    }
    &.rtm {
        animation: fadeInRTM 0.2s ease-in-out;
    }
}

.chat_wrap {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &.hidden {
        display: none;
    }
}

// ANIMATION CORNER
@keyframes fadeInMTL {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0);
    }
}

@keyframes fadeInRTM {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0);
    }
}
</style>