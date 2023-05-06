<template>
    <section class="new_channel_wrap">
        <h2>Create a new channel</h2>
        <form @submit="handleNewChannelSubmit">
            <label for="channel_name">Channel name</label>
            <input v-model="channelName" type="text" id="channel_name" name="channel_name" placeholder="Channel name" required>
            <label for="channel_description">Channel description</label>
            <select v-model="channelType" id="channel_type" name="channel_type" required>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
            </select>
            <label for="channel_password">Channel password</label>
            <input v-model="password" type="password" id="channel_password" name="channel_password" placeholder="Channel password" required>
            <button type="submit">Create</button>
        </form>
    </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useModalStore } from '@/stores/modal'

const chatStore = useChatStore()
const modalStore = useModalStore()

const props = defineProps<{}>()
const password = ref('')
const channelName = ref('')
const channelType = ref('')

const handleNewChannelSubmit = async (e: Event) => {
    await chatStore.createChannel(channelName.value, channelType.value, password.value)
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