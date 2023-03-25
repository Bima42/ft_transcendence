<template>
    <div class="userinput-wrapper">
        <template v-if="editing">
            <span>{{ userValue }}</span>
            <font-awesome-icon @click="startEditing" icon="fa-pencil" />
        </template>
        <template v-else>
            <input v-model="userValue" @keydown.enter="save" />
            <font-awesome-icon @click="save" icon="fa-solid fa-check" />
            <font-awesome-icon @click="cancel" icon="fa-solid fa-xmark" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editing = ref(true);

const userValue = ref('mamamCItaxX')
const startEditing = () => {
    editing.value = !editing.value;
};

const save = () => {
    editing.value = !editing.value;
};

const cancel = () => {
    editing.value = !editing.value;
};
</script>
<style scoped lang="scss">
.userinput-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .fa-pencil {
        color: $yellow;
        &:hover {
            cursor: pointer;
            filter: hue-rotate(180deg);
        }
    }

    .fa-xmark {
        color: red;
        &:hover {
            cursor: pointer;
        }
    }

    .fa-check {
        color: green;
        &:hover {
            cursor: pointer;
        }
    }
}
</style>