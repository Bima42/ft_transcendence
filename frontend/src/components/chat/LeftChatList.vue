<template>
  <div class="chat-sidebar">
    <ChatUserList header="Friends online" :userList="dummy">
    </ChatUserList>
    <ChatUserList header="People in the room" :userList="dummy2">
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
        isActive: false,
      },
      {
        name: 'Mabi',
        isActive: false,
      },
      {
        name: 'Te',
        isActive: false,
      },
      {
        name: 'Bimsadasdaa',
        isActive: false,
      },
      {
        name: 'Maasdadabi',
        isActive: false,
      },
      {
        name: 'Tasdasde',
        isActive: false,
      },
      {
        name: 'Biasdasdma',
        isActive: false,
      },
      {
        name: 'Masdasdabi',
        isActive: false,
      },
      {
        name: 'Tasdadsasde',
        isActive: false,
      },
      {
        name: 'Biasdasdama',
        isActive: false,
      },
      {
        name: 'Maasdasdabi',
        isActive: false,
      },
      {
        name: 'Tasdasde',
        isActive: false,
      },
    ]
)

const dummy2 = ref(
    [
      {
        name: 'Bima',
        isActive: false,
      },
      {
        name: 'Mabi',
        isActive: false,
      },
      {
        name: 'Te',
        isActive: false,
      },
      {
        name: 'Bimsadasdaa',
        isActive: false,
      },
      {
        name: 'Maasdadabi',
        isActive: false,
      },
      {
        name: 'Tasdasde',
        isActive: false,
      },
      {
        name: 'Biasdasdma',
        isActive: false,
      },
      {
        name: 'Masdasdabi',
        isActive: false,
      },
      {
        name: 'Tasdadsasde',
        isActive: false,
      },
      {
        name: 'Biasdasdama',
        isActive: false,
      },
      {
        name: 'Maasdasdabi',
        isActive: false,
      },
      {
        name: 'Tasdasde',
        isActive: false,
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
