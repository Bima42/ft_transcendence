<template>
	<section class="user_actions">
		<h2>{{ modalStore.data.user.username }}</h2>
		<ButtonCustom :style="'big'" :click="toggleNewModal">
			View profile
		</ButtonCustom>
		<section class="chat_actions_buttons">
			<template v-if="userRole >= UserChatRoleEnum.Admin">
				<h4>Admin actions</h4>
				<section class="buttons_wrap">
					<ButtonCustom :style="'small'">
						kick
					</ButtonCustom>
					<ButtonCustom :style="'small'">
						ban
					</ButtonCustom>
					<ButtonCustom :style="'small'">
						mute
					</ButtonCustom>
					<ButtonCustom :style="'small'">
						promote
					</ButtonCustom>
					<ButtonCustom :style="'small'">
						demote
					</ButtonCustom>
				</section>
			</template>
			<UserInteractions />
		</section>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue'
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import UserInteractions from '@/components/user/UserInteractions.vue';
import { UserChatRoleEnum } from '@/interfaces/user/IUserChat'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'

const modalStore = useModalStore()
const chatStore = useChatStore()
const userStore = useUserStore()

const userRole = ref(UserChatRoleEnum.Unknown)
onMounted(async () => {
	userRole.value = await chatStore.getRoleFromUserId(userStore.user?.id ?? 0)
})

const toggleNewModal = () => {
	modalStore.resetStateKeepData()
	modalStore.loadAndDisplay(TheModal, UserInformations, {...modalStore.data})
}

</script>

<style scoped lang="scss">
.user_actions {
	display: flex;
	flex-direction: column;
	gap: $small_gap;
	justify-content: center;
	align-items: center;

	.chat_actions_buttons {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: $small_gap;
		flex-wrap: wrap;

		.buttons_wrap {
			display: flex;
			justify-content: center;
			flex-direction: row;
			gap: 5px;
			flex-wrap: wrap;
		}
	}
}
</style>
