<template>
    <div class="chat_element" v-for="x in 20">
        <h3>Chat {{ x }}</h3>
    </div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to get the clicked chat ID and display the message according to the chat ID
 * received from the parent
 *
 * @param {String} chatId - This is the chat ID that is received from the parent
 */
import { defineProps, ref } from 'vue'

const props = defineProps<{
    chatId: string
}>()

const chatId = ref(props.chatId)
</script>

<style scoped lang="scss">

</style>