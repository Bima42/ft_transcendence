<template>
    <div class="message_wrap" :class="[fromOther ? 'left' : 'right']">
        <div class="sender" v-show="fromOther">
            Sender
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
import { defineProps, ref } from 'vue'

const props = defineProps<{
    fromOther: boolean
}>()

const fromOther = ref(props.fromOther)
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