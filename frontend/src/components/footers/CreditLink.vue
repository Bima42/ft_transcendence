<template>
    <section class="footer-credit-wrap">
        <router-link to="/credits">Credits</router-link>
    </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.footer-credit-wrap {
    grid-area: $footer;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    padding: 10px;

    a {
        text-shadow: none;
        color: $secondary;
    }
}
</style>
