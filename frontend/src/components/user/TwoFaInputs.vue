<template>
    <section class="two_fa_wrap">
        <ButtonCustom
            @click.once="toggleTwoFaStatus"
            :style="'small'"
        >
            Enable 2FA
        </ButtonCustom>
        <ButtonCustom
            @click.once="generateQrCode"
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
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { post } from '../../../utils'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const userStore = useUserStore()

const enableTwoFa = ref(false)
const qrCodeImage = ref('')
const toggleTwoFaStatus = () => {
    enableTwoFa.value = !enableTwoFa.value
	try {
		userStore.updateTwoFaStatus(enableTwoFa.value)
	} catch (err: any) {
		alert(err.message)
	}
}

const generateQrCode = () => {
    post('2fa/generate', 'Impossible to generate QR code: Please try again later')
        .then(data => {
            qrCodeImage.value = data.qrCodeImage
        })
        .catch(err => alert(err.message))
}
</script>

<style scoped lang="scss">
.two_fa_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $medium_gap;
    padding: 0 30px;

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
