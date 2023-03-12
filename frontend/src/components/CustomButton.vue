<template>
  <button :class="props.styles">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  styles?: String,
}>()

</script>

<style scoped lang="scss">
button {
  border-radius: 16px;
  background: $yellow;
  padding: 5px 12px;
  border: none;

  &:hover {
    cursor: pointer;
    filter: hue-rotate(180deg);
  }

  &.fat {
    font-weight: 900;
  }
}
</style>