<template>
  <section class="chat-wrapper">
    <ChatUserList></ChatUserList>
    <div class="main-box">
      <ChatTopSection></ChatTopSection>
      <ChatWindow></ChatWindow>
      <TypeBox></TypeBox>
      <CustomButton id="new-channel" @click="clickHandler">Create new channel</CustomButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import {useModalStore} from "@/stores/modal"

const modalStore = useModalStore()

import ChatUserList from './LeftChatList.vue';
import ChatTopSection from "@/components/chat/ChatTopSection.vue";
import TypeBox from "@/components/chat/TypeBox.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import NewChannelModal from '@/components/modal/NewChannelModal.vue';
import CustomButton from "@/components/CustomButton.vue";
import Modal from "@/components/modal/TheModal.vue";

const data = modalStore.data.data

function clickHandler(e: Event) {
  if (!e.target)
    return
  const target = e.target as HTMLElement
  if (target.id === 'new-channel') {
    modalStore.loadAndDisplay(Modal, NewChannelModal, {})
  }
}
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
    width: 75%;
  }
}
</style>
