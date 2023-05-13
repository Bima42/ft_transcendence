<template>
    <section class="new_channel_wrap">
        <h2>Join a channel</h2>
        <div class="channel_list" v-if="chatStore.notSubscribedChannelsList.length !== 0">
            <div class="channel_line" v-for="chat in chatStore.notSubscribedChannelsList" :key="chat.id" @click="handleClick(chat)">
                <h3>{{ chat.name }}</h3>
                <font-awesome-icon v-if="chat.password" icon="fa-lock"/>
            </div>
        </div>
        <div class="no_channel_content" v-else>
            <h3>No channel available</h3>
            <ButtonCustom :style="'big'" :click="modalStore.resetState">Close</ButtonCustom>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import type IChat from '@/interfaces/chat/IChat'
import { useModalStore } from '@/stores/modal'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';

const chatStore = useChatStore()
const modalStore = useModalStore()

onMounted(async () => {
    chatStore.updateStore()
})

const handleClick = async (chat: IChat) => {
    let password = undefined
    if (chat.password) {
		password = prompt("Password:") || undefined
    }
    await chatStore.joinChannel(chat, password)
    modalStore.resetState()
    chatStore.updateStore()
    return
}
</script>

<style scoped lang="scss">
.new_channel_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    gap: 20px;

    .channel_list {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid $tertiary;
        max-height: 200px;
        overflow-x: scroll;
        width: 100%;

        .channel_line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            cursor: pointer;
            width: 100%;
            background: $transparent-quaternary;
            border-bottom: 1px dotted $tertiary;
        }
    }

    .no_channel_content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: red;
    }
}
</style>
