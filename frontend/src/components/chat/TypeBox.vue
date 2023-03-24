<template>
  <div class="chat-input-container">
    <input v-model="msgContent" type="text" placeholder="Type a message..." v-on:keyup.enter="sendMessage">
    <CustomButton @click="sendMessage">Send</CustomButton>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue';
import { post } from '../../../utils';
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import type IChatMessage from '@/interfaces/chat/IChatMessage';

const msgContent = ref('');
const chatStore = useChatStore();
const userStore = useAuthStore();

async function executeCommand(cmd: string[]) {
  if (! chatStore.currentChat )
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

  switch (cmd[0]) {
    case 'add':
      const targetId = chatStore.findUserIdFromName(cmd[1]);
      const url = `chat/rooms/${chatStore.currentChat.id}/add/${targetId}`;
      await put(url, 'cannot add user')
      break;

    default:
      break;
  }

  if (! commandsList.includes(cmd[0].slice(1))){
    console.error(`unknown chat command: ${cmd[0]}`);
    return;
  }
  console.log(`targetId = ${targetId}`);
}

async function sendMessage() {
  const msg = msgContent.value.trim();
  if (!chatStore.currentChat || msg == "") return;

  // Check for chat commands
  if (msg.charAt(0) == '/') {
    executeCommand(msg.split(' '));
  }
  else {

    // Format: NewMessageDto from back
    const sentMsg = {
      content: msgContent.value,
      senderId: userStore.user?.id,
      chatId: chatStore.currentChat.id,
    };

    chatStore.sendMessage(sentMsg);
  }
  //msgContent.value = "";
}
</script>

<style scoped lang="scss">
.chat-input-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;

  input {
    flex: 1;
    height: 30px;
    border: 1px solid yellow;
    background-color: rgb(49, 49, 47);
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 5px;
    color: white;
  }
}
</style>
