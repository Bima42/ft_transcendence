<template>
    <div class="error_box">
        <h3>{{ props.message }}</h3>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    message: string
}>()
</script>

<style scoped lang="scss">
.error_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: bold;
    border: 4px solid red;
    border-radius: 30px;
    padding: 10px;
}

</style>