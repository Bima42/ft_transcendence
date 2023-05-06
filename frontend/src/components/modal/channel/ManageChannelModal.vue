<template>
    <section class="manage_channel_wrap">
        <h2>Edit Channel</h2>
        <form @submit="handleSubmit">

            <div class="channel_infos">
                <div class="channel_info">
                    <h3>Channel Name:</h3>
                    <input v-if="edit" type="text" v-model="newName" :placeholder="chatStore.currentChat.name"/>
                    <h4 v-else>{{ chatStore.currentChat.name }}</h4>
                </div>
                <div class="channel_info">
                    <h3>Channel Password:</h3>
                    <input v-if="edit" type="text" v-model="newPassword" placeholder="Channel Password" onsubmit=""/>
                    <h4 v-else>********</h4>
                </div>
                <ButtonCustom :style="'big'" @click="submitForm" :loading="loading">
                    <h2>{{ edit ? 'save' : 'edit' }}</h2>
                </ButtonCustom>
            </div>
        </form>


    </section>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import {useChatStore} from '@/stores/chat'
import PhaserContainer from '@/components/PhaserContainer.vue';

const chatStore = useChatStore()
const newName = ref('')
const newPassword = ref('')

const edit = ref(false)
const loading = ref(false)

const handleSubmit = () => {
    console.log(newPassword, newName)
}

const submitForm = (e: Event) => {
    e.preventDefault()
    if (edit.value) {
        loading.value = true
        loading.value = false
    }
    edit.value = !edit.value
}
</script>

<style scoped lang="scss">
.manage_channel_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-weight: bold;

    &:hover {
        cursor: pointer;
    }

    .channel_infos {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 10px;
        font-weight: bold;

        .channel_info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 5px;
            font-weight: lighter;
        }
    }

    h3 {
        text-decoration: underline;
    }
}
</style>