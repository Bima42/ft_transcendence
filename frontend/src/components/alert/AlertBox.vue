<template>
    <section class="alert">
        <div :class="['alert_container', alertStore.error ? 'error' : '']">
            <div class="alert_content">
                <div class="alert_content_title" v-if="alertStore.title">
                    <h1>{{ alertStore.title }}</h1>
                </div>
                <div class="alert_content_text" v-if="alertStore.message">
                    <p>{{ alertStore.message }}</p>
                </div>
                <div class="alert_content_button">
                    <button @click="alertStore.show = false">Button</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'
import {useAlertStore} from '@/stores/alert'

const alertStore = useAlertStore()
const props = defineProps<{}>()
// Case 1 Doit pouvoir display une info et ensuite dire ok pour fermer
// possibilite de passer un prompt
</script>

<style scoped lang="scss">
.alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    overflow: hidden;
    z-index: 9;
    @media (max-width: 768px) {
        padding: 20px;
    }
    .alert_container {
        position: relative;
        border-radius: 8px;
        box-shadow: 8px 16px 32px 0 rgba(31, 31, 31, 0.08);
        background-color: $background;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 60px;
        border: 2px solid $tertiary;
        &.error {
            border: 2px solid red;
        }
        @media (max-width: 768px) {
            padding: 20px;
        }
    }
}

</style>