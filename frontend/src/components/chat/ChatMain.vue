<template>
  <section class="chat-wrapper">
    <ChatUserList></ChatUserList>
    <div class="main-box">
      <ChatTopSection></ChatTopSection>
      <div class="chat-display"></div>
      <TypeBox></TypeBox>
    </div>
  </section>
</template>

<script setup lang="ts">
import ChatUserList from './LeftChatList.vue';
import ChatTopSection from "@/components/chat/ChatTopSection.vue";
import TypeBox from "@/components/chat/TypeBox.vue";
</script>

<style scoped lang="scss">
.chat-wrapper {
  grid-area: $main;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .main-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;


    .chat-display {
      flex-grow: 1;
      width: 100%;
      background: $yellow;
      min-height: 80%;
    }
  }
}
</style>
