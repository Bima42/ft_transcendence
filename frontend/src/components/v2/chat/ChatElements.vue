<template>
    <div class="chat_element">
        <ChatMessage
            v-for="x in 20"
            :key="x"
            :fromOther="x % 2 === 0"
        >
            Message number kshjdbfjkh sdfbgkhjdsfbgkj sfdhbgikuj sbjksbg jkhsbg kjsdbfg kjsbdkj gbsdkjgb skhjgb kblkasdjflkajslfkjsdl
            kfjlksd jflksdj flsjlf jlalfjlsdhfgjklsdhg jklshdgkjl sdjkg hsdkjlgh sjkdhg jksdhg kjsdhg kjsdhhkjgbsdjlhg i\shdgf ljksdg lhjk\sdkfg
            hb\sldkhgkj;\sdfgi\uskdhg k;j\shdgjik h {{ x }}
        </ChatMessage>
    </div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to get the clicked chat ID and display the message according to the chat ID
 * received from the parent
 *
 * @param {number} chatId - This is the chat ID that is received from the parent
 */
import { defineProps, ref } from 'vue'
import ChatMessage from '@/components/v2/chat/ChatMessage.vue';

const props = defineProps<{
    chatId: number
}>()

const chatId = ref(props.chatId)
</script>

<style scoped lang="scss">
.chat_element {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column-reverse;
    overflow-y: scroll;
    gap: 10px;
    padding: 15px;
}
</style>