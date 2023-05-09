<template>
    <section class="action_wrapper">
        <ChatCommandList
            :setSelectedCommand="setAction"
            :isUserBanned="selectedUser.role === 'BANNED'"
        />
    </section>
</template>

<script setup lang="ts">
import ChatCommandList from '@/components/chat/ChatCommandList.vue'
import type IUserChat from '@/interfaces/user/IUserChat'

const props = defineProps<{
    setAction: (action: string) => void,
    selectedUser: IUserChat
}>()
</script>

<style scoped lang="scss">
.action_wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
}
</style>