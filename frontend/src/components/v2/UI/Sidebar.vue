<template>
    <section class="sidebar_wrap">
        <button @click="toggleSidebar">
            <font-awesome-icon icon="fa-bars"/>
        </button>
        <div :class="['sidebar_menu', isActive ? 'active' : '']">
            <font-awesome-icon icon="fa-user"/>
            <font-awesome-icon icon="fa-arrow-right-from-bracket" class="exit"/>
        </div>
    </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

const props = defineProps<{}>()

const isActive = ref(false)
const toggleSidebar = () => {
    isActive.value = !isActive.value
}
</script>

<style scoped lang="scss">
.sidebar_wrap {
    grid-area: header3 / header3-end / footer2-end / footer2-start;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 10px;
    overflow: hidden;

    button {
        position: absolute;
        top: 18px;
        right: 18px;
        background-color: transparent;
        border: 0;
        transition: background-color 0.5s ease-in-out;
        cursor: pointer;

        svg {
            font-size: 30px;
            color: $tertiary;
        }
    }

    .sidebar_menu {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        max-width: 60px;
        gap: 20px;
        background-color: $secondary;
        border: 1px solid $tertiary;
        border-right: 0;
        border-radius: 20px 0 0 20px;
        padding: 20px 0 20px 0;
        transition: transform 0.5s ease-in-out;
        transform: translateX(100%);

        svg {
            color: $tertiary;
            font-size: 20px;
            &.exit {
                color: red;
            }
        }

        &.active {
            transform: translateX(0);
        }
    }
}
</style>