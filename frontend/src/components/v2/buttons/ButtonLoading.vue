<template>
    <button :class="style" @click="click">
        <h3 v-if="!loadingTrack">
            <slot></slot>
        </h3>
        <img v-else src="@/assets/img/loading.svg" alt="loading">
    </button>
</template>

<script setup lang="ts">
import {defineProps, ref, watch} from 'vue'

/**
 * @param style - available styles: 'login'
 * @param loading - boolean to track loading state
 * @param click - function to execute on click
 */
const props = defineProps<{
    style?: string
    loading: boolean
    click?: () => void
}>()

const style = props.style;
const loadingTrack = ref(props.loading);
const click = props.click;

watch(() => props.loading, (loading) => {
    loadingTrack.value = loading;
})
</script>

<style scoped lang="scss">
button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: $secondary;
    border: 1px solid $tertiary;
    color: $quaternary;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    width: auto;
    height: auto;

    img {
        width: 30px;
        height: 30px;
    }
}

</style>