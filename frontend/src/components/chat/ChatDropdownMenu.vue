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
import dropdown from 'vue-dropdowns'
import { useChatStore } from '@/stores/chat'

let chatStore = useChatStore();
const props = defineProps<{
    chatList: Object,
    name: String,
}>();


function methodToRunOnSelect(payload) {
    //console.log("New selected: " + JSON.stringify(payload));
    console.log("New selected: " + payload.name);
    console.log("store value: " + chatStore.currentChatName);

    chatStore.currentChatName = payload.name;
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
