<template>
	<div class="element_line" v-for="(data, index) in friendList" @click="showUserProfile(data.friend.username)" :key="index">
		<UserPicture :type="'small'" :url="data.friend.avatar" :isSelf="false" :status="data.friend.status" :pictureDotSize="'medium'"/>
		<h3>{{ data.friend.username }}</h3>
		<h3>Rank {{ data.rank }}</h3>
	</div>
</template>

<script setup lang="ts">
import UserPicture from '@/components/avatar/UserPicture.vue'
import { useFriendStore } from '@/stores/friend'
import TheModal from '@/components/modal/TheModal.vue'
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import { useModalStore } from '@/stores/modal'
import type IFriend from '@/interfaces/user/IFriend'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const modalStore = useModalStore()
const friendStore = useFriendStore()
const userStore = useUserStore()

const friendList = ref<{friend: IFriend, rank: number}[]>([])
const loadDatas = () => {
	friendStore.updateStoreDatas()
	friendStore.friends.forEach((friend) => {
		userStore.getRank(friend.id).then((res) => {
			friendList.value.push({friend: friend, rank: res})
		})
	})
}
loadDatas()

const showUserProfile = async (username: string) => {
	const user = await friendStore.getUserInfos(username)
	modalStore.loadAndDisplay(TheModal, UserInformations, {user: user})
}
</script>

<style scoped lang="scss">
.element_line {
	padding: 10px 30px 10px 30px;

	&:hover {
		cursor: pointer;
	}
}
</style>
