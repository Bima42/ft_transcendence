<template>
    <section class="new_channel_wrap">
        <h2>Join a channel</h2>
        <div class="channel_list" v-if="chatStore.notSubscribedChannelsList.length !== 0">
            <div class="channel_line" v-for="chat in chatStore.notSubscribedChannelsList" :key="chat.id"
                 @click="handleClick(chat)">
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
import type IChat from '@/interfaces/chat/IChat'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat'
import { useAlertStore } from '@/stores/alert'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { ref } from 'vue'

const chatStore = useChatStore()
const modalStore = useModalStore()
const alertStore = useAlertStore()
const selectedChat = ref<IChat>()

chatStore.updateStore()

const handleClick = (chat: IChat) => {
    selectedChat.value = chat
    if (!chat.password) joinAChannel(undefined)
    else {
        alertStore.setPasswordAlert(
            'This channel is protected by a password',
            'Enter the password',
            joinAChannel)
    }
    return
}

const joinAChannel = async (password: string | undefined): Promise<boolean> =>{
    chatStore.joinChannel(selectedChat.value!, password)
        .then((res) => {
            if (!res) return false
            modalStore.resetState()
            chatStore.updateStore()
            chatStore.setCurrentChat(selectedChat.value!.id.toString())
            return true
        }).catch(() => {
            return false
        })
    return true;
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
        overflow-x: auto;
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
            gap: 10px;
            text-align: center;
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
