<template>
    <div class="userinput-wrapper">
        <template v-if="editing">
            <h3>{{ userValue }}</h3>
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
import type IUserUpdate from '@/interfaces/user/IUserUpdate'
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore()
const userStore = useUserStore()
const editing = ref(true);

const userValue = ref(userStore.user?.username)
const startEditing = () => {
    editing.value = !editing.value;
};

const save = () => {
    editing.value = !editing.value;
    if (!userValue.value)
      return
	const newValue = userValue.value.trim()
	if (newValue.length < 2 || newValue.length > 20 || !newValue.match("^[a-zA-Z0-9_-]+$")) {
		alertStore.setErrorAlert("username constraints: between 2 and 20 characters and contains only alphanumericals characters and/or -_")
		return
	}
    const infos: IUserUpdate = { username: userValue.value }
	userStore.updateInfos(infos).then((res) => {
		userValue.value = userStore.user?.username
	})
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
    gap: $small_gap;

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
