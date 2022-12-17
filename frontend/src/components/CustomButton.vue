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
  border-radius: $border-radius;
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

  &:focus{
    outline-color: $yellow;
	outline-style: outset;
	outline-width: 4px;
  }
}
</style>
