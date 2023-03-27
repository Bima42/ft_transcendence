<template>
  <div class="chat-sidebar">
    <ChatUserList header="Friends online" :userList="friendUsers">
    </ChatUserList>
    <ChatUserList header="People in the room" :userList="currentRoomUsers">
    </ChatUserList>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted } from 'vue'
import ChatUserList from '@/components/chat/ChatUserList.vue'
import {useChatStore} from "@/stores/chat";
import type IUserChat from '@/interfaces/user/IUserChat';
import type IChat from '@/interfaces/chat/IChat';

const chatStore = useChatStore();
const currentRoomUsers = ref<IUserChat[]>([]);
const friendUsers = ref<IUserChat[]>([]);

function updateLists(chat: IChat) {
    if (!chat) { return; }
    currentRoomUsers.value = chat.users;
}

chatStore.$onAction((context) => {
    context.after((result: IChat) => {
        if (context.name == "setCurrentChat" && result) {
            updateLists(result);
        }
    })
});

chatStore.socket.on("updateChannelList", (chat: IChat) => {
  updateLists(chat);
});

</script>

<style scoped lang="scss">
.chat-sidebar {
  width: 25%;
  min-width: 25%;
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

</style>
