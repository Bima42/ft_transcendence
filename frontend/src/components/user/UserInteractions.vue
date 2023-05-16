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
import { useModalStore } from '@/stores/modal';
import { useFriendStore } from '@/stores/friend';
import { useGameStore } from '@/stores/game';
import { ref } from 'vue';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import type IUser from '@/interfaces/user/IUser';
import { useRouter } from 'vue-router';
import type IGameSettings from '@/interfaces/game/IGameSettings';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
	invitePlay?: boolean,
	targetUser?: IUser,
}>()

const userStore = useUserStore()
const modalStore = useModalStore()
const friendStore = useFriendStore()
const gameStore = useGameStore()
const router = useRouter()

const isBlocked = ref(false)
const isFriend = ref(false)
const isRequestSent = ref(false)
const user = ref(props.targetUser ? props.targetUser : modalStore.data.user)

isFriend.value = friendStore.isFriend(user.value.id)
isBlocked.value = friendStore.isBlocked(user.value.id)
friendStore.isWaitingRequest(user.value.username).then(res => isRequestSent.value = res)

const addOrRemoveFriend = async () => {
	try {
		if (isFriend.value) {
			isFriend.value = !(await friendStore.removeFriend(user.value.username))
		} else {
			if (!isRequestSent.value)
				isRequestSent.value = await friendStore.addFriend(user.value.username)
			else {
				isRequestSent.value = !(await friendStore.cancelFriendRequest(user.value.username))
			}
		}
	} catch (e: any) {
		alert(e.message)
	}
}

const blockOrUnblockUser = async () => {
	if (isBlocked.value) {
		isBlocked.value = !(await friendStore.unblockUser(user.value.username))
	} else {
		isBlocked.value = await friendStore.blockUser(user.value.username)
	}
}

const inviteToPlay = async () => {
	console.log(`invite ${user.value.username} to play`)
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
	router.push('joinGame')
}

</script>

<style scoped lang="scss">

</style>
