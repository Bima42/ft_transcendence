<template>
	<section class="button_wrap">
		<ButtonCustom :style="'small'" :click="addOrRemoveFriend">
			{{ isFriend ? 'Remove friend' : isRequestSent ? 'Cancel request' : 'Add friend' }}
		</ButtonCustom>
		<ButtonCustom :style="'small'" :click="blockOrUnblockUser">
			{{ isBlocked ? 'Unblock' : 'Block' }}
		</ButtonCustom>
		<ButtonCustom v-if="invitePlay" :style="'small'">
			Invite to play a game
		</ButtonCustom>
	</section>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal';
import { useFriendStore } from '@/stores/friend';
import { onMounted, ref } from 'vue';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';

const props = defineProps<{
	invitePlay?: boolean
}>()

const modalStore = useModalStore()
const friendStore = useFriendStore()

const isBlocked = ref(false)
const isFriend = ref(false)
const canUnblock = ref(false)
const isRequestSent = ref(false)

const addOrRemoveFriend = () => {
	if (isFriend.value) {
		friendStore.removeFriend(modalStore.data.user.username).then(res => isFriend.value = res)
	} else {
		if (!isRequestSent.value)
			friendStore.addFriend(modalStore.data.user.username).then(res => isRequestSent.value = res)
		else
			friendStore.cancelFriendRequest(modalStore.data.user.username).then(res => isRequestSent.value = res)
	}
}

const blockOrUnblockUser = () => {
	if (isBlocked.value && canUnblock.value) {
		friendStore.unblockUser(modalStore.data.user.username).then(res => isBlocked.value = res)
	} else {
		friendStore.blockUser(modalStore.data.user.username).then(res => isBlocked.value = res)
	}
}

onMounted(() => {
	friendStore.isFriend(modalStore.data.user.username).then(res => isFriend.value = res)
	friendStore.isWaitingRequest(modalStore.data.user.username).then(res => isRequestSent.value = res)
	friendStore.isBlocked(modalStore.data.user.username).then(res => isBlocked.value = res)
	friendStore.canUnblock(modalStore.data.user.username).then(res => canUnblock.value = res)
})
</script>

<style scoped lang="scss">

</style>