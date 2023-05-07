<template>
	<section class="user_actions">
		<h2>{{ modalStore.data.username }}</h2>
		<ButtonCustom :style="'big'" :click="toggleNewModal">
			View profile
		</ButtonCustom>
		<section class="chat_actions_buttons">
			<template v-if="userRole === role.admin">
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
			<template v-if="userRole <= role.user">
				<UserInteractions />
			</template>
		</section>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import { useModalStore } from '@/stores/modal'
import TheModal from '@/components/modal/TheModal.vue'
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import { useFriendStore } from '@/stores/friend';
import UserInteractions from '@/components/user/UserInteractions.vue';

enum role { admin = 0, user = 1 }

const modalStore = useModalStore()

// WE NEED A FUNCTION TO CATCH THE ROLE OF A USER TO DISPLAY WHAT HE CAN AND CANNOT DO
// onMounted(async () => {
//     await userRole = chatStore.getRole()
// })
const userRole = role.user

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