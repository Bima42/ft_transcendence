<template>
    <section class="password_change_wrapper">
        <label for="pass">Password (8 characters minimum):</label>
        <input type="password" id="pass" name="password"
               minlength="8" required>
        <input type="password" id="pass" name="password"
               minlength="8" required>
    </section>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

const props = defineProps<{}>()
</script>

<style scoped lang="scss">

</style>