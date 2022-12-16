<template>
  <div class="modal-container" @click="exitClick">
    <section class="main-box" @click.stop>
      <XButton class="exit-button" @click="exitClick"/>
      <div class="a-four">
        <slot></slot>
      </div>
      <CustomButton @click="printClick" type="fat black" name="Imprimer" class="print-button"/>
    </section>
  </div>
</template>

<script lang="ts" setup>
import XButton from "@/components/XButton.vue";
import { useModalStore } from "@/stores/modal.ts";
import CustomButton from "@/components/CustomButton.vue";

const modalStore = useModalStore()

function exitClick(e: Event) {
  modalStore.resetState()
}

function printClick() {
  print()
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

  .main-box {
    position: relative;
    border-radius: 8px;
    box-shadow: 8px 16px 32px 0 rgba(31, 31, 31, 0.08);
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 75px;
    width: 100%;
    height: 100%;

    .print-button {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }

  .exit-button {
    position: absolute;
    z-index: 1;
    top: 20px;
    right: 20px;
  }

  .a-four {
    display: flex;
    justify-content: center;
    overflow: auto;
  }
}
</style>

<style lang="scss">
@media print {
  #page {
    display: none;
  }

  #app {
    background: none !important;
  }

  .main-frame {
    display: none;
  }

  nav {
    display: none !important;
  }

  .main-box {
    border-radius: 0 !important;
    box-shadow: unset !important;
    transform: unset !important;
  }

  .exit-button {
    display: none;
  }

  .print-button {
    display: none !important;
  }

  .a-four {
    display: block !important;
    width: 210mm;
    height: 297mm;
  }
}
</style>