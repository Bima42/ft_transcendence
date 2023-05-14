<template>
    <div class="header">
        <img src="@/assets/img/logo_name.svg" alt="logo" class="logo" @click="router.push('/')">
    </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()
</script>

<style scoped lang="scss">
.header {
    grid-area: $header1-2;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;

    .logo {
        max-width: 100%;
        height: 100%;
        cursor: pointer;
    }
}

</style>
