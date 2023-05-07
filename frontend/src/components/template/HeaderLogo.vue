<template>
    <img src="@/assets/img/logo_name.svg" alt="logo" class="logo" @click="router.push('/')">
</template>

<script setup lang="ts">
import {defineProps} from 'vue'
import {useRouter} from 'vue-router'

const props = defineProps<{}>()

const router = useRouter()
</script>

<style scoped lang="scss">
.logo {
    grid-area: $header1-2;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
</style>