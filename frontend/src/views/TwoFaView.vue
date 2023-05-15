<template>
    <section class="otp_wrapper">
        <img src="@/assets/img/logo_name.svg" alt="logo" class="logo" @click="router.push('/')">
        <h2>Use your 2FA app to get your code</h2>
        <input @keydown.enter="toggleCode" type="text" placeholder="Enter your code here" v-model="code">
        <ButtonCustom @click="toggleCode" :style="'big'">Submit</ButtonCustom>
        <p>If you did not set up any 2FA authenticator, please contact the support <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">here</a></p>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useRouter } from 'vue-router'

const code = ref('')
const userStore = useUserStore()
const router = useRouter()

const toggleCode = () => {
    userStore.verifyTwoFaCode(code.value)
        .then(() => {
            router.push('/main/index')
        }).catch(e => alert(e.message))
}

</script>

<style lang="scss" scoped>
.otp_wrapper {
    grid-area: $bigmain;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 90%;

    img {
        cursor: pointer;
    }
}
</style>
