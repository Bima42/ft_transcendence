<template>
    <ButtonCustom :style="'small'" @click="goToWhisper(props.user.username)">
        Send a private message
    </ButtonCustom>
</template>

<script setup lang="ts">
import type IUser from '@/interfaces/user/IUser'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useChatStore } from '@/stores/chat'

const props = defineProps<{
    user: IUser
    callback?: () => void | null
}>()

const chatStore = useChatStore()

const goToWhisper = (name: string) => {
    chatStore.whisperChatList.map((chat) => {
        if (chat.name === name) {
            chatStore.setCurrentChat(chat.id.toString()).catch((err) => {
                console.log(err)
            })
            if (props.callback) {
                props.callback()
            }
            return
        }
    })
    chatStore.createWhisper(name).then((res) => {
        chatStore.setCurrentChat(res.id.toString())
        chatStore.updateStore()
    }).catch((err) => {
        console.log(err)
    })
    if (props.callback) {
        props.callback()
    }
    return
}
</script>

<style scoped lang="scss">

</style>