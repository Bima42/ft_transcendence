<template>
    <div class="modal-container" @click="exitClick">
        <section class="main-box" @click.stop >
            <XButton :size="'big'" class="exit-button" @click="exitClick"/>
            <slot></slot>
        </section>
    </div>
</template>

<script lang="ts" setup>
import XButton from '@/components/buttons/XButton.vue'
import {useModalStore} from '@/stores/modal'

const modalStore = useModalStore()

function exitClick(e: Event) {
    modalStore.resetState()
}
</script>

<style lang="scss" scoped>
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    overflow: hidden;
    z-index: 9;
    @media (max-width: 768px) {
        padding: 20px;
    }

    .main-box {
        position: relative;
        border-radius: 8px;
        box-shadow: 8px 16px 32px 0 rgba(31, 31, 31, 0.08);
        background-color: $background;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 60px;
        border: 2px solid $tertiary;
        @media (max-width: 768px) {
            padding: 20px;
        }
    }

    .exit-button {
        position: absolute;
        z-index: 10;
        top: 20px;
        right: 20px;
        @media (max-width: 768px) {
            display: none;
        }
    }
}
</style>
