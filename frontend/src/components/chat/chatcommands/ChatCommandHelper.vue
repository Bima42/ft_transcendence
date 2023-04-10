<template>
    <button @click="toggleHelpBoxModal"><font-awesome-icon icon="fa-solid fa-question" /></button>
    <div class="helpbox-tooltip" v-show="helpBox">
        <h1>List of commands:</h1>
        <ChatCommand v-for="(commandList, name) in allCommands" :list="commandList">{{ name }}</ChatCommand>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import ChatCommand from '@/components/chat/chatcommands/ChatCommand.vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue';

const modalStore = useModalStore()

const props = defineProps<{}>()

const helpBox = ref(false);
function toggleHelpBoxModal() {
    modalStore.loadAndDisplay(TheModal, ChatCommand, { list: allCommands.value })
}

const allCommands = ref({
    "Owner": [
        {
            "command": "/deleteChannel",
            "description": "Delete the current channel"
        },
        {
            "command": "/setPassword",
            "description": "Set the password to join a protected channel"
        }],
    "Admin": [
        {
            "command": "/add",
            "description": "Adds a user to the channel"
        },
        {
            "command": "/kick",
            "description": "Kick a user from the channel"
        },
        {
            "command": "/ban",
            "description": "Ban a user from the channel"
        },
        {
            "command": "/mute",
            "description": "Mute the user for a while"
        },
        {
            "command": "/promote",
            "description": "Promote a user to administrator"
        },
        {
            "command": "/demote",
            "description": "Demotes an admin to user"
        }],
    "User": [
        {
            "command": "/leave",
            "description": "Leave the current channel"
        },
        {
            "command": "/addFriend",
            "description": "Add another user to its friends"
        },
        {
            "command": "/invite",
            "description": "Invite another user to play !"
        }]
});
</script>

<style scoped lang="scss">
button {
    border: none;
    background-color: $tertiary;
    color: $secondary;
    border-radius: 50%;
    transition: all 200ms ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10pt;
    width: 20px;
    height: 20px;

    &:hover {
        cursor: pointer;
    }
}

.helpbox-tooltip {
    position: absolute;
    left: 100%;
    bottom: calc(100% + 5px);
    background-color: $yellow;
    border-radius: 5px;
    padding: 5px;
    color: black;
    z-index: 100;

    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 200px;

    h1 {
        font-weight: 900;
        font-size: 20px;
    }
}

</style>