<template>
    <section class="new_channel_wrap">
        <h2>Create a new channel</h2>
        <form @submit="handleNewChannelSubmit" @keydown.enter="handleNewChannelSubmit">
            <label for="channel_name">Channel name</label>
            <input v-model="channelName" type="text" id="channel_name" name="channel_name" placeholder="Channel name"
                   required>
            <label for="channel_type">Channel type</label>
            <select v-model="channelType" id="channel_type" name="channel_type" required>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
            </select>
            <label for="channel_password">Channel password</label>
            <input v-model="password" type="password" id="channel_password" name="channel_password"
                   placeholder="Optional">
            <ButtonCustom type="submit">Create</ButtonCustom>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useModalStore } from '@/stores/modal'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const chatStore = useChatStore()
const modalStore = useModalStore()

const password = ref('')
const channelName = ref('')
const channelType = ref('')

const handleNewChannelSubmit = (e: Event) => {
    e.preventDefault()
    chatStore.createChannel(channelName.value, channelType.value, password.value)
        .then(() => {
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
    }
}
</style>
