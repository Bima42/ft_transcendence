<template>
    <div class="message_wrap" :class="side">
        <div class="sender" @click="toggleUserActions(props.sender)" v-show="side === 'left'">
            {{ props.sender.username }}
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
import UserActions from '@/components/chat/UserActions.vue'
import type IUser from '@/interfaces/user/IUser'

const props = defineProps<{
    sender: IUser
    userIs: number
}>()

const modalStore = useModalStore()

let side = ref(computed(() => {
    return props.sender.id === props.userIs ? 'right' : 'left'
}))

const toggleUserActions = (user: IUser) => {
    modalStore.loadAndDisplay(TheModal, UserActions, { user: user })
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

    &.left {
        align-self: flex-start;
        background-color: $transparent-quaternary;
    }
    &.right {
        align-self: flex-end;
        background-color: $transparent-tertiary;
    }

    .sender {
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