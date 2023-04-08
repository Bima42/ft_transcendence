<template>
    <div class="user_picture">
        <img :src="url" alt="User picture">
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onUpdated } from 'vue'

const props = defineProps<{
    url: string | undefined
}>()

const defaultUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/default.png`

const imgUrl = ref(props.url || defaultUrl)

onUpdated(() => {
    imgUrl.value = props.url || defaultUrl
})
</script>

<style scoped lang="scss">
.user_picture {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>