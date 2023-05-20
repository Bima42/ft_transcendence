<template>
    <section class="new_channel_wrap">
        <h2>Create a new Whisper</h2>
        <form @submit="handleNewChannelSubmit" @keydown.enter="handleNewChannelSubmit">
            <label for="username">User name</label>
            <input v-model="username" type="text" id="user_name" name="user_name" placeholder="User name" required>
            <ButtonCustom type="submit">Create</ButtonCustom>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useModalStore } from '@/stores/modal'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import type IChat from '@/interfaces/chat/IChat'

const chatStore = useChatStore()
const modalStore = useModalStore()

const password = ref('')
const username = ref('')

const handleNewChannelSubmit = (e: Event) => {
    e.preventDefault()
    chatStore.createWhisper(username.value)
	.then((newChat: IChat) => {
		chatStore.setCurrentChat(newChat.id.toString())
		chatStore.updateStore()
		modalStore.resetState()
	})
}
</script>

<style scoped lang="scss">
.new_channel_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    gap: 10px;
    text-align: center;

    form {
        display: flex;
        flex-direction: column;
        gap: 5px;

		label, input {
			font-family: 'Martian Mono', sans-serif;
		}
	}
}
</style>
