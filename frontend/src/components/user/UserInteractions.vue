<template>
	<ButtonCustom :style="'small'" :click="addOrRemoveFriend">
		{{ isFriend ? 'Remove friend' : isRequestSent ? 'Cancel request' : 'Add friend' }}
	</ButtonCustom>
	<ButtonCustom :style="'small'" :click="blockOrUnblockUser">
		{{ isBlocked ? 'Unblock' : 'Block' }}
	</ButtonCustom>
	<ButtonCustom v-if="props.invitePlay" :style="'small'">
		Invite to play
	</ButtonCustom>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal';
import { useFriendStore } from '@/stores/friend';
import { ref } from 'vue';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import type IUser from '@/interfaces/user/IUser';

const props = defineProps<{
	invitePlay?: boolean,
	targetUser?: IUser,
}>()

const modalStore = useModalStore()
const friendStore = useFriendStore()

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

</script>

<style scoped lang="scss">

</style>
