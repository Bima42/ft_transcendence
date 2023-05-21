<template>
	<ButtonCustom :style="'small'" :click="addOrRemoveFriend">
		{{ isFriend ? 'Remove friend' : isRequestSent ? 'Cancel request' : 'Add friend' }}
	</ButtonCustom>
	<ButtonCustom :style="'small'" :click="blockOrUnblockUser">
		{{ isBlocked ? 'Unblock' : 'Block' }}
	</ButtonCustom>
	<ButtonCustom v-if="props.invitePlay" :style="'small'" :click="inviteToPlay">
		Invite to play
	</ButtonCustom>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import { useFriendStore } from '@/stores/friend'
import { useGameStore } from '@/stores/game'
import { computed, onUpdated, ref } from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'
import type IUser from '@/interfaces/user/IUser'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAlertStore } from '@/stores/alert'

const props = defineProps<{
	invitePlay?: boolean,
	targetUser?: IUser,
}>()

const alertStore = useAlertStore()
const userStore = useUserStore()
const modalStore = useModalStore()
const friendStore = useFriendStore()
const gameStore = useGameStore()
const router = useRouter()

const isBlocked = computed(() => friendStore.isBlocked(user.value.id))
const isFriend = computed(() => friendStore.isFriend(user.value.id))
const user = ref(props.targetUser ? props.targetUser : modalStore.data.user)
const isRequestSent = computed(() => friendStore.isRequestSent(user.value.id))

onUpdated(() => {
	user.value = props.targetUser ? props.targetUser : modalStore.data.user
})

const addOrRemoveFriend = async () => {
	try {
		if (isFriend.value) {
			await friendStore.removeFriend(user.value.username)
		} else {
			if (!isRequestSent.value)
				await friendStore.addFriend(user.value.username)
			else {
				await friendStore.cancelFriendRequest(user.value.username)
			}
		}
	} catch (e: any) {
		alertStore.setErrorAlert(e)
	}
}

const blockOrUnblockUser = async () => {
	if (isBlocked.value) {
		await friendStore.unblockUser(user.value.username)
	} else {
		await friendStore.blockUser(user.value.username)
	}
}

const inviteToPlay = () => {
	if (!userStore.user || !user.value)
		return;

	gameStore.currentGame = {
		game: {
			type: 'CLASSIC',
			status: "INVITING",
			users: [userStore.user, user]
		},
		player1: userStore.user,
		player2: user,
	}
	modalStore.resetState()
	router.replace('/main/joinGame')
}

</script>

<style scoped lang="scss">

</style>
