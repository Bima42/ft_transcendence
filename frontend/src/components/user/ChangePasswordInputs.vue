<template>
    <section class="password_change_wrapper">
        <h2>Change password</h2>
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
.password_change_wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    padding: 10px 40px 10px 40px;
}
</style>