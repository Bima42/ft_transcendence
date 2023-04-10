<template>
    <div class="avatar_upload">
        <h4>New Avatar</h4>
        <ButtonCustom
            :loading="loading"
            :style="'small'"
        >
            <label class="custom_file_upload">
                <input type="file" accept="image/*" @change="uploadAvatar"/>
                <font-awesome-icon icon="fa-ellipsis"/>
            </label>
        </ButtonCustom>
        <ButtonCustom
            type="submit"
            :click="updateAvatar"
            :style="'small'"
            :loading="loading"
        >
            <font-awesome-icon icon="fa-arrow-up-from-bracket"/>
        </ButtonCustom>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { defineProps, ref } from 'vue'
import ButtonCustom from '@/components/v2/buttons/ButtonCustom.vue';

const loading = ref(false)
const props = defineProps<{}>()
const userStore = useUserStore()
let file: File | null = null

async function uploadAvatar(event: Event) {
    file = (event.target as HTMLInputElement).files![0]
}

const updateAvatar = () => {
    if (file) {
        const formData = new FormData()
        formData.append('avatar', file, file.name)
        userStore.uploadAvatar(formData, loading)
    }
}
</script>

<style scoped lang="scss">
.avatar_upload {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    input[type="file"] {
        display: none;
    }
}

</style>