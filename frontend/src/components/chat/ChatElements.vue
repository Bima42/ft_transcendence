<template>
	<div class="chat_element" v-if="chatStore.isChatOpen">
		<ChatMessage
			v-for="message in chatStore.currentChat?.messages"
			:key="message.id"
			:author="message.author"
			:sentAt="message.sentAt"
			:userIs="currentUser"
		>
			{{ message.content }}
		</ChatMessage>
	</div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to get the clicked chat ID and display the message according to the chat ID
 * received from the parent
 *
 * @param {number} chatId - This is the chat ID that is received from the parent
 */
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import ChatMessage from '@/components/chat/ChatMessage.vue'

const userStore = useUserStore()
const chatStore = useChatStore()

const currentUser = userStore.user?.id
</script>

<style scoped lang="scss">
.chat_element {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column-reverse;
	overflow-y: scroll;
	gap: $small_gap;
	padding: 15px;
    max-width: 980px;
}
</style>
