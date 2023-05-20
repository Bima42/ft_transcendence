<template>
    <section class="alert" >
        <div :class="['alert_container', alertStore.error ? 'error' : '']">
            <div class="alert_content">
                <div class="alert_content_title" v-if="alertStore.title">
                    <h1>{{ alertStore.title }}</h1>
                </div>
                <div class="alert_content_text" v-if="alertStore.message">
                    <p>{{ alertStore.message }}</p>
                </div>
                <form v-if="alertStore.passwordInput" @submit="handleSubmit">
                    <input type="password" placeholder="Password" v-model="password" autofocus/>
                </form>
                <div class="alert_content_button">
                    <ButtonCustom @click="alertStore.passwordCallback ? handleSubmit() : handleClick()"
                                  :style="'big' + (alertStore.error ? ' danger' : '')"
                                  @keydown.enter="alertStore.passwordCallback ? handleSubmit() : handleClick()"
                                  :autofocus="!alertStore.passwordCallback"
                    >
                        {{ !alertStore.callBack ? 'Ok' : 'Yes' }}
                    </ButtonCustom>
                    <ButtonCustom @click="alertStore.resetState()"
                                  :style="'big'"
                                  v-if="!alertStore.error && alertStore.callBack"
                    >
                        No
                    </ButtonCustom>
                    <ButtonCustom @click="alertStore.resetState()"
                                  :style="'big'"
                                  v-if="alertStore.passwordCallback"
                    >
                        Cancel
                    </ButtonCustom>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
/**
 * @description HOW TO USE ME
 * @example To use this component, use the store invokers such as: setValidationAlert, setErrorAlert etc..
 * Here is an example for the validation alert:
 * callback : const testFunction = () => { console.log('Foo Bar') }
 * call : <button @click="alertStore.setValidationAlert(
 *             'You are about to kill Bima',
 *             'Are you sure ?',
 *             testFunction)" />
 *
 * For the setPasswordAlert, it's the same process but the function must return a bool and recieve a string
 * const passwordValid = (pass: string) => {
 *     console.log('entered callback')
 *     console.log('pass recieved : ', pass)
 *     if (pass === '1234') {
 *         console.log('valid')
 *         return true
 *     }
 *     return false
 * }
 */
import { useAlertStore } from '@/stores/alert'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import { ref } from 'vue';

const alertStore = useAlertStore()
const password = ref<string>('')

const handleClick = () => {
    if (alertStore.callBack)
        alertStore.callBack()
    alertStore.resetState()
}

const handleSubmit = (e?: Event) => {
    if (e)
        e.preventDefault()
    if (alertStore.passwordCallback) {
        alertStore.passwordCallback(password.value).then((res: boolean) => {
            if (res)
                alertStore.resetState()
        })
    }
}
</script>

<style scoped lang="scss">
.alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    overflow: hidden;
    z-index: 9;
    @media (max-width: 768px) {
        padding: 20px;
    }
    .alert_container {
        position: relative;
        border-radius: 8px;
        box-shadow: 8px 16px 32px 0 rgba(31, 31, 31, 0.08);
        background-color: $background;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 60px;
        border: 2px solid $tertiary;
        &.error {
            border: 2px solid red;
        }
        @media (max-width: 768px) {
            padding: 20px;
        }

        .alert_content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }

        .alert_content_button {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }
    }
}

</style>