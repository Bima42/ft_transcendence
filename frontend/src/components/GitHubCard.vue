<template>
  <section class="github-card">
    <a :href="props.link" target="_blank">
      <img style="width: 100px" src="@/assets/img/GitHub.svg"/>
    </a>
    <slot></slot>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  link: String,
}>()
</script>

<style lang="scss">
.github-card {
  min-width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  h2 {
    font-size: 18px;
  }

  .quote {
    font-style: italic;
    font-weight: bold;
    font-size: 16px;
  }

  img {
    transform: scale(100%);
    transition: all .2s ease-in-out;
    &:hover {
      transform: scale(95%);
      transition: all .2s ease-in-out;
    }
  }
}

</style>