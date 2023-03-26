<template>
    <div class="dropdown-wrapper" :class="{active: toggled}" @click="dropMenu">
        <slot></slot>
        <font-awesome-icon icon="fa-solid fa-chevron-left"/>
    </div>
    <div v-for="command in props.list" v-show="toggled">
        <h2>{{ command.command }}<br>
            {{ command.description }}</h2>
    </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'

const props = defineProps<{
    list: object
}>()

const toggled = ref(false);

function dropMenu() {
    toggled.value = !toggled.value;
}
</script>

<style scoped lang="scss">
.dropdown-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    gap: 5px;

    &:hover {
        cursor: pointer;
    }

    svg {
        height: 10pt;
        transition: all 100ms ease-in-out;
        transform: rotate(0deg);
    }

    &.active {
        svg {
            transform: rotate(-90deg);
        }
    }
}

h2 {
    font-size: 10pt;
    font-weight: 400;
}

</style>