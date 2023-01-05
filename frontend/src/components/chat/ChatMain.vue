<template>
  <section class="chat-wrapper">
    <ChatUserList></ChatUserList>
    <div class="main-box">
      <ChatTopSection></ChatTopSection>
      <ChatWindow></ChatWindow>
      <TypeBox></TypeBox>
      <modal></modal>
    </div>
  </section>
</template>

<script setup lang="ts">
import ChatUserList from './LeftChatList.vue';
import ChatTopSection from "@/components/chat/ChatTopSection.vue";
import TypeBox from "@/components/chat/TypeBox.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import Modal from '@/components/modal/Modal.vue';

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
  }
}
</style>
