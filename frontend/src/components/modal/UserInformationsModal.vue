<template>
    <section class="user_information_modal">
		<hr>
        <section class="user_data">
            <UserPicture :type="'small'" :url="modalStore.data.user.avatar"
				:isSelf="false" :status="modalStore.data.user.status" :pictureDotSize="'medium'" />
            <section class="data">
                <h2>{{ modalStore.data.user.username }}</h2>
				<section class="buttons_wrap">
					<UserInteractions :invitePlay="true"/>
				</section>
				<ButtonCustom :style="'small'" @click="goToDetailedProfile(modalStore.data.user.id)">
					View Detailed Profile
				</ButtonCustom>
                <ButtonCustom :style="'small'" @click="goToWhisper(modalStore.data.user.username)">
                    Send a private message
                </ButtonCustom>
            </section>
        </section>
        <hr>
    </section>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import UserPicture from '@/components/avatar/UserPicture.vue'
import UserInteractions from '@/components/user/UserInteractions.vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const modalStore = useModalStore()
const chatStore = useChatStore()

const goToDetailedProfile = (id: string) => {
	router.push(`/main/profile/${id}`);
	modalStore.resetState()
}

const goToWhisper = (name: string) => {
    chatStore.whisperChatList.map((chat) => {
        if (chat.name === name) {
            chatStore.setCurrentChat(chat.id.toString()).catch((err) => {
                console.log(err)
            })
            modalStore.resetState()
            return
        }
    })
    chatStore.createWhisper(name).then((res) => {
        chatStore.setCurrentChat(res.id.toString())
        chatStore.updateStore()
    }).catch((err) => {
        console.log(err)
    })
    modalStore.resetState()
    return
}
</script>

<style scoped lang="scss">
.user_information_modal {
    display: flex;
    flex-direction: column;
    gap: $medium_gap;
    justify-content: center;

    hr {
        border-color: $tertiary;
        width: 80%;
        align-self: center;
    }

    .user_data {
        display: flex;
        flex-direction: row;
        gap: $small_gap;
        justify-content: center;
        align-items: center;

        .data {
            display: flex;
            flex-direction: column;
            gap: $small_gap;
            justify-content: center;
            align-items: flex-start;

            .buttons_wrap {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                gap: 5px;
                flex-wrap: wrap;
            }
        }
    }
    .user_score {
        display: flex;
        flex-direction: column;
        gap: $small_gap;
        justify-content: center;
        align-items: center;
    }
}
</style>