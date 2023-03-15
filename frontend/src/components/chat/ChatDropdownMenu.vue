<template>
  <dropdown class="my-dropdown-toggle"
            :options="chatList"
            :selected="name"
            v-on:updateOption="methodToRunOnSelect"
            :placeholder="name"
            :closeOnOutsideClick="true">
  </dropdown>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import dropdown from 'vue-dropdowns';
import { useChatStore } from '@/stores/chat';
import type IChat from '@/interfaces/chat/IChat';

let chatStore = useChatStore();
const props = defineProps<{
    chatList: Object,
    name: String,
}>();


function methodToRunOnSelect(payload) {

    chatStore.currentChat = payload;
}
</script>

<style lang="scss">
.my-dropdown-toggle {
  border-radius: 5px;

    ::v-deep .dropdown-toggle {
      color: tomato;
      font-size: 25px;
      font-weight: 800;
    }

    ::v-deep .dropdown-toggle-placeholder {
      color: #c4c4c4;
    }
}
</style>
