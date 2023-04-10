<template>
    <section class="highscore-wrap">
        <h1>Your highest score:</h1>
        <h2>1'000'000</h2>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.highscore-wrap {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: 100%;

    h1 {
        font-size: 32px;
    }

    h2 {
        font-size: 24px;
    }

    svg {
        max-height: 100px;
    }
}

</style>