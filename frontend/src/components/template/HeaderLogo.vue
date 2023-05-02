<template>
    <section class="header_logo_wrapper">
        <img src="@/assets/img/logo_name.svg" alt="logo" class="logo" @click="router.push('/')">
    </section>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{}>()

const router = useRouter()
</script>

<style scoped lang="scss">
.header_logo_wrapper {
    grid-area: $header1-2;
    display: flex;
    justify-content: flex-start;
    padding: 20px;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>