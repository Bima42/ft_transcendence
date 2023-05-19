<template>
    <section class="community_wrapper">
        <section class="community_header">
            <font-awesome-icon v-if="chatStore.isChatOpen" icon="fa-chevron-left" @click="resetChat"/>
            <h2
                v-if="!chatStore.isChatOpen"
                v-for="chat in chatListsSources"
                :key="chat.id"
                @click="selectChatList(chat.id)"
                :class="[selectedChatList === chat.id ? '' : 'not_selected']"
            >
                {{ chat.name }}
            </h2>
            <h2 @click="toggleEditChatModal" v-else>
                {{ chatStore.currentChat?.name || "Chat name"}}
            </h2>
        </section>
        <div class="community_content">
            <template :class="[chatStore.isChatOpen ? 'hidden' : 'shown mtl']">
                <Suspense>
                    <ChatList
                        :selectedChatList="selectedChatList"
                    />
                </Suspense>
            </template>
            <template :class="['chat_wrap', chatStore.isChatOpen ? 'shown rtm' : 'hidden']">
                <Suspense>
                    <ChatElements/>
                </Suspense>
                <TypeBox/>
            </template>
        </div>
        <ButtonCustom class="new_chat_button"
                      :style="'big circular'"
                      v-if="!chatStore.isChatOpen"
                      :click="toggleAddChatModal"
        >
            <font-awesome-icon icon="fa-plus"/>
        </ButtonCustom>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatList from '@/components/chat/ChatList.vue'
import ChatElements from '@/components/chat/ChatElements.vue'
import TypeBox from '@/components/chat/TypeBox.vue'
import { useChatStore } from '@/stores/chat'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue'
import SelectChannelActionModal from '@/components/modal/channel/SelectChannelActionModal.vue';
import EditChatModal from '@/components/modal/channel/EditChatModal.vue';
import { get } from '../../utils';
import UserInformations from '@/components/modal/UserInformationsModal.vue';
import { useUserStore } from '@/stores/user';

const selectedChatList = ref('public')
const chatStore = useChatStore()
const modalStore = useModalStore()
const userStore = useUserStore()

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
	chatStore.updateStore()
    selectedChatList.value = chatID
}
const resetChat = () => {
    chatStore.resetState()
}

const toggleAddChatModal = () => {
    modalStore.loadAndDisplay(TheModal, SelectChannelActionModal, {})
}

const toggleEditChatModal = () => {
	if (chatStore.currentChat?.type != "WHISPER")
		modalStore.loadAndDisplay(TheModal, EditChatModal, {})
	else if (chatStore.currentChat?.type == "WHISPER") {
		const author = chatStore.currentChat?.users.find((user) => user.user.id != userStore.user?.id)?.user
		get(`users/id/${author?.id}`, 'Cannot get user details').then((user) => {
			modalStore.loadAndDisplay(TheModal, UserInformations, {user: user})
		}).catch((err) => {
			alert(err)
		})
	}
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
        gap: $medium_gap;
        color: $quaternary;

        h2:hover {
            cursor: pointer;
        }

        .not_selected {
            transition: color 0.2s ease-in-out;
            color: $secondary;
        }

        svg {
            height: 50%;
            position: absolute;
            left: 10px;
            top: calc(50% - 10px);
            cursor: pointer;
        }
    }

    .community_content {
        height: 100%;
        width: 100%;
        overflow: auto;
    }

    .new_chat_button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1;
    }
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
