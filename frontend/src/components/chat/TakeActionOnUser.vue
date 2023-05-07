<template>
    <section class="action_wrapper">
        <ChatCommandList :setSelectedCommand="setAction" />
    </section>
</template>

<script setup lang="ts">
import ChatCommandList from '@/components/chat/ChatCommandList.vue';

const props = defineProps<{
    setAction: (action: string) => void,
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