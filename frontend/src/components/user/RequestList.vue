<template>
	<div class="element_line" v-for="(user, index) in requests" :key="index">
		<div class="user_infos" @click="showUserProfile(user.username)">
			<UserPicture :type="'small'" :url="user.avatar" :isSelf="false" :status="user.status"
				:pictureDotSize="'medium'"/>
			<h3>{{ user.username }}</h3>
		</div>
		<div class="user_decisions">
			<font-awesome-icon icon="fa-check" color="green" size="2x" @click="acceptRequest(user.username)"/>
			<font-awesome-icon icon="fa-xmark" color="red" size="2x" @click="declineRequest(user.username)"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFriendStore } from '@/stores/friend'
import TheModal from '@/components/modal/TheModal.vue'
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import { useModalStore } from '@/stores/modal'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UserPicture from '@/components/avatar/UserPicture.vue'
import { ref } from 'vue'
import type IUser from '@/interfaces/user/IUser'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
const modalStore = useModalStore()
const friendStore = useFriendStore()

const requests = ref<IUser[]>([])

function loadDatas() {
	friendStore.updateStoreDatas()
	friendStore.getAllPendingRequests().then((res) => {
		requests.value = res
	})
}
loadDatas()

const showUserProfile = async (username: string) => {
	const user = await friendStore.getUserInfos(username)
	modalStore.loadAndDisplay(TheModal, UserInformations, {user: user})
}

const acceptRequest = async (username: string) => {
	await friendStore.acceptFriendRequest(username)
		.catch(e => alertStore.setErrorAlert(e))
	requests.value = await friendStore.getAllPendingRequests()
}

const declineRequest = async (username: string) => {
	await friendStore.declineFriendRequest(username)
		.catch(e => alert(e))
	requests.value = await friendStore.getAllPendingRequests()
}
</script>

<style scoped lang="scss">
.element_line {

	&:hover {
		cursor: pointer;
	}

	.user_infos, .user_decisions {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.user_decisions {
		gap: $medium_gap;
	}

	.user_infos {
		width: 50%;
	}
}
</style>
