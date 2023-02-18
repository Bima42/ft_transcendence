<template>
  <span class="avatar-container" :class="props.type">
    <img src="@/assets/img/placeholder_avatar.jpg"/>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: String,
}>()
</script>

<style lang="scss">
.avatar-container {
  display: block;
  content: "";
  border-radius: 500px;
  background-color: $yellow;
  overflow: hidden;
  border: 2px solid $yellow;
  box-sizing: content-box;

  &.big {
    width: 20vw;
    height: 20vw;

    img:hover {
      cursor: pointer;
      transition: all .1s ease-in-out;
      filter: blur(2px);
    }
  }

  &.small {
    width: 3vw;
    height: 3vw;
  }

  img {
    width: 100%;
  }
}
</style>