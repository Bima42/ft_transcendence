<template>
  <div class="chat-sidebar">
    <ChatUserList header="Friends online" :userList="dummy">
    </ChatUserList>
    <ChatUserList header="People in the room" :userList="dummy">
    </ChatUserList>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ChatUserList from '@/components/chat/ChatUserList.vue'

const dummy = ref(
    [
      {
        name: 'Bima',
      },
      {
        name: 'Mabi',
      },
      {
        name: 'Te',
      },
      {
        name: 'Bimsadasdaa',
      },
      {
        name: 'Maasdadabi',
      },
      {
        name: 'Tasdasde',
      },{
      name: 'Biasdasdma',
    },
      {
        name: 'Masdasdabi',
      },
      {
        name: 'Tasdadsasde',
      },{
      name: 'Biasdasdama',
    },
      {
        name: 'Maasdasdabi',
      },
      {
        name: 'Tasdasde',
      },


    ]
)

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
