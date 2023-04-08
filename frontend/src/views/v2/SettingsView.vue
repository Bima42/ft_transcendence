<template>
    <section class="settings_wrapper">
        <div class="left_side">
            <UserPicture :url="userStore.user?.avatar"/>
        </div>
        <div class="right_side">
        </div>
    </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useUserStore } from '@/stores/user'
import UserPicture from '@/components/v2/UserPicture.vue'
const userStore = useUserStore()

const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.settings_wrapper {
    grid-area: $bigmain;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .left_side {
        width: 100%;
        height: 100%;
        background: red;
    }

    .right_side {
        width: 100%;
        height: 100%;
        background: blue;
    }
}
</style>