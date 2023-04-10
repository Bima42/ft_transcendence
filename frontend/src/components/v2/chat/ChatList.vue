<template>
    <div class="content_element" v-for="x in 20" :id="x"
         @click="toggleChat(x)">
        <h1>Chats {{ x }}</h1>
        <font-awesome-icon icon="fa-chevron-right"/>
    </div>
</template>

<script setup lang="ts">
/**
 * @description This component purpose is to send to the parent the clicked chat id
 *
 * @param {Function} toggleChat - This function is used to send the clicked chat id to the parent
 */
import { defineProps } from 'vue'

const props = defineProps<{
    toggleChat: (id: number) => void
}>()

const toggleChat = (id: number) => {
    props.toggleChat(id)
}

</script>

<style scoped lang="scss">
.content_element {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $tertiary;
    border-top: 1px solid $tertiary;
    background-color: $secondary;
    padding: 30px;

    &:hover {
        cursor: pointer;
    }
}
</style>