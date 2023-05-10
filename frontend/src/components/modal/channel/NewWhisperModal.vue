<template>
    <section class="new_channel_wrap">
        <h2>Create a new Whisper</h2>
        <form @submit="handleNewChannelSubmit">
            <label for="channel_name">User name</label>
            <input v-model="username" type="text" id="user_name" name="user_name" placeholder="User name" required>
            <button type="submit">Whisper</button>
        </form>
    </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useModalStore } from '@/stores/modal'

const chatStore = useChatStore()
const modalStore = useModalStore()

const password = ref('')
const channelName = ref('')
const channelType = ref('')

const handleNewChannelSubmit = async (e: Event) => {
    e.preventDefault()
    console.error(`Implement me !`)
    chatStore.updateStore()
    modalStore.resetState()
}
</script>

<style scoped lang="scss">
.new_channel_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    form {
        display: flex;
        flex-direction: column;
    }
}
</style>
