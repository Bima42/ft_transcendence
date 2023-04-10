<template>
    <section class="command_wrapper">
        <div class="list_pack" v-for="(commandList, name) in allCommands">
            <div class="dropdown-wrapper" @click="dropMenu">
                <h3>{{ name }}</h3>
            </div>
            <div v-for="command in commandList">
                <h2>{{ command.command }}<br>
                    {{ command.description }}</h2><br>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'
import {useModalStore} from '@/stores/modal'

const modalStore = useModalStore()

const props = defineProps<{}>()
const toggled = ref(false);

const allCommands = modalStore.data.list as object
function dropMenu() {
    toggled.value = !toggled.value;
}
</script>

<style scoped lang="scss">
.command_wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;

    .dropdown-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        gap: 5px;

        &:hover {
            cursor: pointer;
        }
    }
}

h2 {
    font-size: 10pt;
    font-weight: 400;
}

</style>