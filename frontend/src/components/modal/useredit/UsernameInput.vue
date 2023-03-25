<template>
    <div>
        <div v-if="!editing">
            <span>{{ userValue }}</span>
            <button @click="startEditing">
                <i class="fas fa-pencil-alt">Check</i>
            </button>
        </div>

        <div v-else>
            <input v-model="userValue" @keydown.enter="save" />
            <button @click="save">
                <i class="fas fa-check"></i>
            </button>
            <button @click="cancel">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editing = ref(true);

const userValue = ref('mamamCItaxX')
const startEditing = () => {
    editing.value = true;
};

const save = () => {
    editing.value = false;
};

const cancel = () => {
    editing.value = false;
};
</script>
<style scoped lang="scss">
</style>