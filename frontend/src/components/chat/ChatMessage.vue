<template>
    <div class="message_wrap" :class="side">
        <div class="author" @click="toggleUserInformations(props.author)" v-show="side === 'left'">
            {{ props.author.username }}
        </div>
        <div class="content">
            <slot></slot>
        </div>
        <div class="time">
            12:23
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue'
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import type { IAuthor } from '@/interfaces/chat/IChatMessage'
import { get } from '../../../utils'

const props = defineProps<{
    author: IAuthor
    userIs: number | undefined
}>()

const modalStore = useModalStore()

let side = ref(computed(() => {
    return props.author.id === props.userIs ? 'right' : 'left'
}))
const toggleUserInformations = async (author: IAuthor) => {
    const user = await get(`users/id/${author.id}`, 'Cannot get user details')
    modalStore.loadAndDisplay(TheModal, UserInformations, {user: user})
}
</script>

<style scoped lang="scss">
.message_wrap {
    position: relative;
    display: flex;
    padding: 15px 10px;
    flex-direction: column;
    justify-content: center;
    text-align: start;
    max-width: 85%;
    border-radius: 10px;
    gap: 5px;
    font-family: 'Martian Mono', sans-serif;
    min-width: 50px;

    &.left {
        align-self: flex-start;
        background-color: $transparent-quaternary;
    }

    &.right {
        align-self: flex-end;
        background-color: $tertiary;
    }

    .author {
        font-weight: bold;

        &:hover {
            cursor: pointer;
        }
    }

    .content {
        font-size: 14px;
    }

    .time {
        position: absolute;
        font-size: 10px;
        align-self: end;
        line-height: 5px;
        bottom: 5px;
        right: 5px;
    }
}
</style>
