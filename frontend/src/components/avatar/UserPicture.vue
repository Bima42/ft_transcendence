<template>
    <div class="user_picture" :class="props.type">
        <img :src="url" alt="User picture">
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onUpdated } from 'vue'

/**
 * @typedef {Object} Props
 * @property {string} existing type of the picture : small, big
 * @property {string | undefined} url of the picture
 */
const props = defineProps<{
    url: string | undefined
    type: string
}>()

const defaultUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/default.png`

const imgUrl = ref(props.url || defaultUrl)

onUpdated(() => {
    imgUrl.value = props.url || defaultUrl
})
</script>

<style scoped lang="scss">
.user_picture {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;

    &.small {
        height: 10vh;
        width: 10vh;
    }

    &.big {
        height: 20vh;
        width: 20vh;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>