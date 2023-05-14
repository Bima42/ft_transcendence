<template>
    <section class="index-wrapper">
        <h2>Welcome to pong</h2>
        <router-link to="/main/joinGame">
            Start playing
        </router-link>
        <router-link to="/main/community">
            Start Chatting
        </router-link>
        <router-link to="/main/profile">
            Profile
        </router-link>
    </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{}>()
</script>

<style scoped lang="scss">
a {
    color: $quaternary;
    text-decoration: none;

    &:hover {
        color: $quaternary;
        text-decoration: none;
    }
}

.index-wrapper {
    grid-area: $bigmain;
    display: flex;
    gap: $medium_gap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
}

</style>
