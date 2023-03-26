<template>
  <div class="modal-container" @click="exitClick">
    <section class="main-box" @click.stop>
      <XButton :size="'big'" class="exit-button" @click="exitClick"/>
        <slot></slot>
    </section>
  </div>
</template>

<script lang="ts" setup>
import XButton from '@/components/multiusage/XButton.vue'
import { useModalStore } from '@/stores/modal'

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
  padding: 100px;
  overflow: auto;
  z-index: 9;

  .main-box {
    position: relative;
    border-radius: 8px;
    box-shadow: 8px 16px 32px 0 rgba(31, 31, 31, 0.08);
    background-color: $light-gray;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 60px;
  }

  .exit-button {
    position: absolute;
    z-index: 10;
    top: 20px;
    right: 20px;
  }
}
</style>
