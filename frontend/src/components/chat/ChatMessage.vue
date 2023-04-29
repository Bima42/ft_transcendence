<template>
    <div class="message_wrap" :class="side">
        <div class="sender" v-show="side === 'left'">
            {{ props.userName }}
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

const props = defineProps<{
    fromUser: number
    userIs: number
    userName: string
}>()

let side = ref(computed(() => {
    return props.fromUser === props.userIs ? 'right' : 'left'
}))

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