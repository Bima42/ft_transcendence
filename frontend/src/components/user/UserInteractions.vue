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

const props = defineProps<{
	invitePlay?: boolean,
	targetUser?: IUser,
}>()

const modalStore = useModalStore()
const friendStore = useFriendStore()
const gameStore = useGameStore()
const router = useRouter()

const isBlocked = ref(false)
const isFriend = ref(false)
const canUnblock = ref(false)
const isRequestSent = ref(false)
const user = ref(props.targetUser ? props.targetUser : modalStore.data.user)

console.log(user.value)
friendStore.isFriend(user.value.username).then(res => isFriend.value = res)
friendStore.isWaitingRequest(user.value.username).then(res => isRequestSent.value = res)
friendStore.isBlocked(user.value.username).then(res => isBlocked.value = res)
friendStore.canUnblock(user.value.username).then(res => canUnblock.value = res)

const addOrRemoveFriend = async () => {
	try {
	if (isFriend.value) {
		isFriend.value = !(await friendStore.removeFriend(user.value.username))
	} else {
		if (!isRequestSent.value)
			isRequestSent.value = await friendStore.addFriend(user.value.username)
		else {
			isRequestSent.value = !(await friendStore.cancelFriendRequest(user.value.username))
			console.log(isRequestSent.value)
		}
	}
	} catch (e: any) {
		alert(e.message)
	}
}

const blockOrUnblockUser = async () => {
	if (isBlocked.value && canUnblock.value) {
		isBlocked.value = !(await friendStore.unblockUser(user.value.username))
	} else {
		isBlocked.value = await friendStore.blockUser(user.value.username)
	}
}

const inviteToPlay = async () => {
	console.log(`invite ${user.value.username} to play`)
	const invite = {
		gameType: "CLASSIC",
		userId: user.value.id,
	}
	gameStore.socket.once("matchFound", (_gameSettings: IGameSettings) => {
		console.log("Invitation accepted !")
		router.push(`game`)
	})
	gameStore.socket.once("invitationDeclined", (gameSettings: IGameSettings) => {
		gameStore.socket.off("matchFound")
		alert(`${gameSettings.player2.username} refused your invitation.`)
	})
	gameStore.socket.emit("invitePlayer", invite, (res: string) => {
		if (res === "OK") {
			modalStore.resetState()
			router.push('joinGame')
		} else {
			alert(res);
		}
	})
}

</script>

<style scoped lang="scss">

</style>
