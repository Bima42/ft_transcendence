<template>
    <section class="highscore-wrap">
        <h2>Your highest score:</h2>
        <h3>1'000'000</h3>
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

    svg {
        max-height: 100px;
    }
}

</style>