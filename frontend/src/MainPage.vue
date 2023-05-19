<template>
  <section class="UI-grid">
    <ElSidebar/>
    <HeaderLogo/>
    <TheModal v-if="modalStore.show">
      <Component :is="modalStore.component"/>
    </TheModal>
    <NotificationWrapper v-show="notificationStore.show && notificationStore.notifications.length"/>
    <router-view v-slot="{ Component }">
      <Transition>
        <component :is="Component"/>
      </Transition>
    </router-view>
    <CreditLink v-if="route.name !== 'community' && route.name !== 'profile'"></CreditLink>
  </section>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import CreditLink from '@/components/footers/CreditLink.vue'
import ElSidebar from '@/components/template/ElSidebar.vue'
import TheModal from '@/components/modal/TheModal.vue'
import {useModalStore} from '@/stores/modal'
import HeaderLogo from '@/components/template/HeaderLogo.vue'
import NotificationWrapper from '@/components/NotificationWrapper.vue';
import {useChatStore} from '@/stores/chat';
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import {useUserStore} from '@/stores/user';
import {useNotificationStore} from '@/stores/notification';

const route = useRoute()
const modalStore = useModalStore()
const chatStore = useChatStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

chatStore.socket.on('msg', (data: IChatMessage) => {
  if (data.author.id === userStore.user?.id ||
      chatStore.whisperChatList.some((chat) => chat.id !== data.chatId))
    return

  notificationStore.addNotification({
    picture: data.author?.avatar,
    title: data.author.username,
    message: data.content,
    lifespan: 2000,
  })
})
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  font-weight: normal;
  overflow-x: hidden;
  overflow-y: auto;

  .UI-grid {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 20% 30% 30% 20%;
    grid-template-rows: 10% 30% 30% 20% 10%;
    justify-items: center;
    align-items: center;

    grid-template-areas:
            "header1 header1 header2 header3"
            "left1 main1 main1 right1"
            "left1 main2 main2 right1"
            "left1 main3 main3 right1"
            "footer1 footer1 footer1 footer2";
  }
}
</style>
