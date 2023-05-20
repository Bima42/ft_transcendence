<template>
  <section class="UI-grid">
    <ElSidebar/>
    <HeaderLogo/>
    <TheModal v-if="modalStore.show">
      <Component :is="modalStore.component"/>
    </TheModal>
	<AlertBox v-if="alertStore.show"/>
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
import { useRoute, useRouter } from 'vue-router'
import CreditLink from '@/components/footers/CreditLink.vue'
import ElSidebar from '@/components/template/ElSidebar.vue'
import TheModal from '@/components/modal/TheModal.vue'
import { useModalStore } from '@/stores/modal'
import HeaderLogo from '@/components/template/HeaderLogo.vue'
import AlertBox from '@/components/alert/AlertBox.vue'
import { useAlertStore } from '@/stores/alert'
import NotificationWrapper from '@/components/NotificationWrapper.vue';
import {useChatStore} from '@/stores/chat';
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import {useUserStore} from '@/stores/user';
import {useNotificationStore} from '@/stores/notification';
import type IUser from '@/interfaces/user/IUser';
import { useGameStore } from '@/stores/game';
import { useFriendStore } from '@/stores/friend';
import type IGameSettings from '@/interfaces/game/IGameSettings';

const route = useRoute()
const router = useRouter()

const modalStore = useModalStore()
const userStore = useUserStore()
const chatStore = useChatStore()
const gameStore = useGameStore()
const friendStore = useFriendStore()
const notificationStore = useNotificationStore()
const alertStore = useAlertStore()

friendStore.updateStoreDatas()

chatStore.socket.on('msg', (data: IChatMessage) => {
	if (data.author.id === userStore.user?.id ||
		chatStore.whisperChatList.some((chat) => chat.id !== data.chatId) ||
		chatStore.currentChat?.id == data.chatId)
		return

	notificationStore.addNotification({
		picture: data.author?.avatar,
		title: data.author.username,
		message: data.content,
		lifespan: 3000,
	})
})

chatStore.socket.on('friendOnline', (user: IUser) => {
	notificationStore.addNotification({
		picture: user.avatar,
		message: `${user.username} is online`,
		lifespan: 3000,
	})
})

let receivedInvite = false
const onReceiveGameInvitation = (gameSettings: IGameSettings) => {
	if (receivedInvite)
		return
	receivedInvite = true

	// TODO: silent refuse if already in a game (already checked on server)
	const gameType = gameSettings.game.type
	setTimeout(() => {
		const accept = confirm(`Play a ${gameSettings.game.type.toLowerCase()} game with ${gameSettings.player1.username} ?`)
		if (accept) {
			gameStore.socket.emit("acceptInvitation", gameSettings)
			router.push('game')
		} else {
			gameStore.socket.emit("declineInvitation", gameSettings)
		}
		receivedInvite = false

	}, 100);
	gameStore.socket.once("gameInvitation", onReceiveGameInvitation)
}

gameStore.socket.once("gameInvitation", onReceiveGameInvitation)
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
  background-image: url("@/assets/img/wave.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom;

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
