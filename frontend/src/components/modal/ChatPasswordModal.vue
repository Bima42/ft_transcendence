<template>
    <div class="newchannel-modal-wrapper">
        <h1>Channel {{ modalStore.data.name }} is locked !</h1>
        <p>Please enter the password:</p>
        <div class="chat-input-container">
            <input v-model="chatPassword" type="password" placeholder="password" class="chat-input">
            <div class="button-container">
                <CustomButton @click="onJoinChannel">Join</CustomButton>
                <CustomButton @click="quitButton" styles="cancel">Quit</CustomButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, defineProps} from 'vue'
import {useModalStore} from '@/stores/modal';
import {useChatStore} from '@/stores/chat';
import CustomButton from '@/components/multiusage/CustomButton.vue'
import {put} from '../../../utils'
import type IChat from '@/interfaces/chat/IChat'

const modalStore = useModalStore()
const chatStore = useChatStore();

const chatPassword = ref('');

console.log(`Joining new room: ${JSON.stringify(modalStore.data as IChat)}`);
async function onJoinChannel(_e: Event) {

    let newChat : IChat = modalStore.data as IChat;
    newChat.password = chatPassword.value;

    await put(`chat/rooms/${newChat.id}/join`, 'Cannot join channel', newChat)
        .then((response) => {
            return response.json()
        })
        .then((chat : IChat) => {
            if (chat.users) {
                chatStore.setCurrentChat(chat)
                modalStore.resetState();
            } else {
                // TODO: show something to the user that the password was wrong
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function quitButton(_e: Event) {
    modalStore.resetState();
}
</script>

<style lang="scss" scoped>

.newchannel-modal-wrapper {
    display: flex;
    flex-direction: column; /*aligns items vertically*/
    align-items: left;
    justify-items: left;
    gap: 10px;

    h1 {
        margin-bottom: 20px;
        font-size: 2em;
        font-weight: bold;
        color: rgb(255, 179, 0);
        text-align: center;
    }
    p {
        font-style: italic;
        color: rgb(128, 126, 126);
    }

    .chat-input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        .radio-buttons {
            display: flex;
            color: rgb(255, 179, 0);
            gap: 10px;
        }
        .chat-input-container {
            display: flex;
            flex-direction: column; /*aligns items vertically*/
            align-items: center;
        }

        .chat-input {
            color: rgb(255, 200, 0);
            font-style: italic;
            height: 30px;
            width: 450px;
            border: 1px solid rgb(255, 204, 0);
            background-color: rgb(49, 49, 47);
            border-radius: 5px;
            padding: 0 10px;
        }

        .button-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
    }
}
</style>
