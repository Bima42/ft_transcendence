<template>
  <section class="head-wrap">
    <ChatDropdownMenu :chatList="amazing" name="Rooms"></ChatDropdownMenu>
    <h1>CURRENT CHAT NAME</h1>
    <ChatDropdownMenu :chatList="amazing" name="Whispers"></ChatDropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatDropdownMenu from "@/components/chat/ChatDropdownMenu.vue";

const amazing = ref(
    [
      {
        name: 'SampleChat1',
      },
      {
        name: 'SampleChat2',
      },
      {
        name: 'SampleChat3',
      },
      {
        name: 'SampleChat4',
      },
    ],
)
</script>

<style scoped lang="scss">
.head-wrap {
  flex-grow: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;

  h1 {
    color: $yellow;
    justify-self: center;
    align-self: center;
    font-weight: bold;
    font-size: 24px;
  }

  .cascade-menu {
    width: 100px;
    justify-self: center;
    align-self: center;
  }
}
</style>