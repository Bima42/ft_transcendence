<template>
    <button
        :class="props.style"
        @click="props.click"
        :disabled="disabledTrack"
        ref="button"
    >
        <p v-if="!loadingTrack">
            <slot></slot>
        </p>
        <img v-else src="@/assets/img/loading.svg" alt="loading">
    </button>
</template>

<script setup lang="ts">
/**
 * @param style - available styles: 'login' 'small'
 * @param loading - boolean to track loading state
 * @param click - function to execute on click
 * @param disabled - boolean to disable the button
 *
 * @comments - This button can be a loader display toom just pass him a ref of a boolean to track the loading state
 */
import {defineProps, onMounted, ref, watch} from 'vue'
const props = defineProps<{
    style?: string
    loading?: boolean
    click?: () => void
    disabled?: boolean
    autofocus?: boolean
}>()

const loadingTrack = ref(props.loading)
const disabledTrack = ref(props.disabled)
const button = ref<HTMLButtonElement | null>(null)

watch(() => props.loading, (loading) => {
    loadingTrack.value = loading
})

watch(() => props.disabled, (disabled) => {
    disabledTrack.value = disabled
})

onMounted(() => {
    if (props.autofocus && button.value) button.value.focus()
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
    border-radius: 10px;
    cursor: pointer;
    width: auto;
    height: auto;

    &:hover {
        filter: brightness(1.2);
    }

    &.login {
        padding: 10px;
        img {
            width: 30px;
            height: 30px;
        }
    }

    &.small {
        padding: 5px;
        img {
            width: 15px;
            height: 15px;
        }
    }

    &.circular {
        border-radius: 50%;
    }

    &.big {
        padding: 10px;
        img {
            width: 30px;
            height: 30px;
        }
    }

	&.adapt {
		width: 100%;
	}

    &:disabled {
        filter: brightness(0.5);
        cursor: not-allowed;
    }

	&.danger {
		border-color: red;
	}
}

</style>
