<template>
    <section class="two_fa_wrap">
        <div class="input_wrap">
            <h3>Enable 2FA</h3>
            <input type="checkbox" id="enableTwoFa" v-model="enableTwoFa" @change="toggleTwoFaStatus"/>
        </div>
        <ButtonCustom
            :click="generateQrCode"
            :style="'small'"
            :disabled="!enableTwoFa"
        >
            Generate QR Code
        </ButtonCustom>
        <div class="qr_code_wrap">
            <img v-if="qrCodeImage" :src="qrCodeImage" alt="QR Code"/>
            <h2 v-else>QR Code</h2>
        </div>
    </section>
</template>

<script setup lang="ts">
import {useUserStore} from '@/stores/user'
import {defineProps, ref} from 'vue'
import {post} from '../../../../utils'
import ButtonCustom from '@/components/v2/buttons/ButtonCustom.vue';

const props = defineProps<{}>()
const userStore = useUserStore()

const enableTwoFa = ref(userStore.user!.twoFA)
const qrCodeImage = ref('')
const toggleTwoFaStatus = () => {
    userStore.updateTwoFaStatus(enableTwoFa.value)
}

const generateQrCode = () => {
    post('2fa/generate', 'Impossible to generate QR code: Please try again later')
        .then(response => response.json())
        .then(data => {
            qrCodeImage.value = data.qrCodeImage
        })
        .catch(err => console.log(err))
}
</script>

<style scoped lang="scss">
.two_fa_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .input_wrap {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 20px;

        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            color: $tertiary;
        }
    }


    .qr_code_wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 196px;
        height: 196px;
        border: 1px dotted $tertiary;
        border-radius: 20px;
        color: $tertiary;
    }

}
</style>