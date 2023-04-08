<template>
    <section class="index-wrapper">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Enim facilisis gravida neque convallis a. Lorem ipsum dolor sit amet consectetur adipiscing elit.
            Cras fermentum odio eu feugiat pretium nibh. Volutpat sed cras ornare arcu dui.</p>
    </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.index-wrapper {
    grid-area: $bigmain;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
}

</style>