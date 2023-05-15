<template>
    <button :class="props.size">
        <font-awesome-icon icon="fa-solid fa-xmark" color="white"/>
    </button>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue'

const props = defineProps<{
    size: string,
}>()
</script>

<style lang="scss" scoped>
button {
    border: none;
    background-color: $tertiary;
    border-radius: 50%;
    transition: all 200ms ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;

    &.big {
        font-size: 20pt;
        width: 40px;
        height: 40px;
    }

    &.small {
        font-size: 10pt;
        width: 20px;
        height: 20px;
    }

    &:hover {
        cursor: pointer;
        transform: scale(0.9);
        transition: all 200ms ease-in-out;
    }
}
</style>