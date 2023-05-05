<template>
    <div class="chat-input-container">
        <input v-model="msgContent" type="text" placeholder="Type a message..." v-on:keyup.enter="sendMessage">
        <ButtonCustom
            @click="sendMessage"
            :style="'small'"
        >
            <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </ButtonCustom>
        <ChatCommandHelper/>
    </div>
</template>

<script setup lang="ts">
import { jsonHeaders, put } from '../../../utils';
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import ChatCommandHelper from '@/components/chat/ChatCommandHelper.vue';
import type IChatAction from '@/interfaces/chat/IChatAction';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';

const msgContent = ref('');
const chatStore = useChatStore();
const userStore = useUserStore();

async function executeCommand(cmd: string[]) {
    if (!chatStore.currentChat)
        return;
    const commandsList = [
        // owner commands
        'deleteChannel',  // Delete the current channel
        'setPassword',    // Set the password to join a protected channel
        // admin commands
        'add',            // add a user to the channel
        'kick',           // kick a user from the channel
        'ban',            // ban a user from the channel
        'mute',           // mute the user for a while
        'promote',        // make a user channel administrator
        'demote',         // make a user a simple user
        // user commands
        'leave',           // Leave the current channel
        'addFriend',       // Add another user to its friends
        'invite',          // Invite another user to play !
    ];
    const cmdName = cmd[0].slice(1);
    let url = `chat/rooms/${chatStore.currentChat.id}/user`;
    let action: IChatAction;
    switch (cmdName) {
        case 'kick':
        case 'add':
        case 'ban':
        case 'promote':
        case 'demote':
        case 'mute':
            action = {
                chatId: chatStore.currentChat.id,
                username: cmd[1],
                muteDuration: (cmd.length >= 3 ? parseInt(cmd[2]) : null),
                type: cmdName,
            };
            await put(url, `cannot ${cmdName} user`, jsonHeaders, action)
                .catch(err => console.error(err))
            break;
        case 'leave':
            url = `chat/rooms/leave`;
            await put(url, `cannot leave channel`, jsonHeaders, {chatId: chatStore?.currentChat.id})
                .then(() => {
                    // TODO: Leave chat window ?
                })
                .catch(err => console.error(err))
            break;
        default:
            console.error(`unknown chat command: ${cmdName}`);
            break;
    }
}

async function sendMessage() {
    const msg = msgContent.value.trim();
    if (!chatStore.currentChat || msg == '') return;
    const sentMsg = {
        content: msgContent.value,
        senderId: userStore.user?.id,
        chatId: chatStore.currentChat.id,
    };
    chatStore.sendMessage(sentMsg);
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
        border: 1px solid $tertiary;
        background-color: rgb(49, 49, 47);
        border-radius: 5px;
        padding: 0 10px;
        margin-right: 5px;
        color: white;
    }
}
</style>
