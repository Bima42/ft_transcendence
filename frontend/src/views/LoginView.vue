<template>
    <section class="login-wrapper">
        <img src="@/assets/img/logo_name.svg" alt="logo" class="logo">
        <ButtonCustom :loading="loading" :click="login" :style="'login'">
            Login with 42
        </ButtonCustom>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const loading = ref(false)

const userStore = useUserStore()

async function login() {
    loading.value = true;
    userStore.redirect()
}
</script>

<style scoped lang="scss">
.login-wrapper {
    grid-area: $bigmain;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
    height: 100%;
    gap: 40px;
    animation: appear 1s cubic-bezier(.25, .46, .45, .94) forwards;

    img {
        animation: slide-top 1s cubic-bezier(.25, .46, .45, .94) forwards;
    }

    @keyframes slide-top {
        0% {
            transform: translateY(-100px);
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 100%;
        }
    }
    @keyframes appear {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 100%;
        }
    }
}
</style>