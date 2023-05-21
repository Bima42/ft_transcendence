<template>
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
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import CreditLink from '@/components/footers/CreditLink.vue'
import ElSidebar from '@/components/template/ElSidebar.vue'
import TheModal from '@/components/modal/TheModal.vue'
import { useModalStore } from '@/stores/modal'
import HeaderLogo from '@/components/template/HeaderLogo.vue'
import AlertBox from '@/components/alert/AlertBox.vue'
import NotificationWrapper from '@/components/notifications/NotificationWrapper.vue';
import { useAlertStore } from '@/stores/alert'
import {useChatStore} from '@/stores/chat';
import {useUserStore} from '@/stores/user';
import { useGameStore } from '@/stores/game';
import { useFriendStore } from '@/stores/friend';
import {useNotificationStore} from '@/stores/notification';
import type IChatMessage from '@/interfaces/chat/IChatMessage';
import type IUser from '@/interfaces/user/IUser';
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
		chatStore.subscribedChannelsList.some((chat) => chat.id === data.chatId) ||
		chatStore.currentChat?.id == data.chatId)
		return

	notificationStore.addNotification({
		picture: data.author?.avatar,
		title: data.author.username,
		message: data.content,
		lifespan: 3000,
		redirect: () => {
			chatStore.setCurrentChat(data.chatId.toString())
			router.push('/main/community/')
		}
	})
})

chatStore.socket.on('friendOnline', (user: IUser) => {
	notificationStore.addNotification({
		picture: user.avatar,
		message: `${user.username} is online`,
		lifespan: 3000,
		redirect: () => router.push(`/main/profile/${user.id}`),
	})
})

chatStore.socket.on('friendshipAccepted', (user: IUser) => {
	friendStore.friends.push(user)
	notificationStore.addNotification({
		picture: user.avatar,
		message: `${user.username} accepted your friend request`,
		lifespan: 3000,
		redirect: () => router.push(`/main/profile/${user.id}`),
	})
})

chatStore.socket.on('friendshipRemoved', (user: IUser) => {
	friendStore.friends.splice(friendStore.friends.findIndex(e => e.id === user.id))
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
</style>
