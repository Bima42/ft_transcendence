<template>
    <div class="userinput-wrapper">
        <template v-if="editing">
            <h4>{{ userValue }}</h4>
            <ButtonCustom @click="startEditing" :style="'small'">
                <font-awesome-icon icon="fa-pencil" />
            </ButtonCustom>
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
import { useUserStore } from '@/stores/user';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import { jsonHeaders, patch } from '../../../utils';
import type IUserUpdate from '@/interfaces/user/IUserUpdate'

const userStore = useUserStore()
const editing = ref(true);

const userValue = ref(userStore.user?.username)
const startEditing = () => {
    editing.value = !editing.value;
};

const save = () => {
    editing.value = !editing.value;
    if (!userValue)
      return
    const infos: IUserUpdate = { username: userValue.value as string }
    userStore.updateInfos(infos)
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
    gap: 5px;

    input {
        border: none;
        border-bottom: 1px solid black;
        background: transparent;
        outline: none;
        text-align: center;
        color: white;
        padding: 1px 6px;
        width: auto;
        max-width: 70%;
    }

    .fa-pencil {
        color: $quaternary;
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
