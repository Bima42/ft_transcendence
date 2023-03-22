<template>
  <section class="highscore-wrap">
    <h1>Your highest score:</h1>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFDD42">
      <path
          d="M12 6.76l1.379 4.246h4.465l-3.612 2.625 1.379 4.246-3.611-2.625-3.612 2.625 1.379-4.246-3.612-2.625h4.465l1.38-4.246zm0-6.472l-2.833 8.718h-9.167l7.416 5.389-2.833 8.718 7.417-5.388 7.416 5.388-2.833-8.718 7.417-5.389h-9.167l-2.833-8.718z"/>
    </svg>
    <h2>1'000'000</h2>
  </section>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.highscore-wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;

  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 24px;
  }

  svg {
    max-height: 100px;
  }
}

</style>
