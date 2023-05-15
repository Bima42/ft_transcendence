<template>
  <div class="element_line" v-for="friend in friendList" @click="showUserProfile(friend.username)">
    <UserPicture :type="'small'" :url="friend.avatar" />
    <h3>{{ friend.username }}</h3>
    <div :class="['dot', friend.status === 'ONLINE' ? 'green' : 'red']"/>
  </div>
</template>

<script setup lang="ts">
import UserPicture from '@/components/avatar/UserPicture.vue';
import { useFriendStore } from '@/stores/friend';
import TheModal from '@/components/modal/TheModal.vue';
import UserInformations from '@/components/modal/UserInformationsModal.vue'
import { useModalStore } from '@/stores/modal';
import { onMounted, ref } from 'vue';
import type IFriend from '@/interfaces/user/IFriend';

const modalStore = useModalStore()
const friendStore = useFriendStore()

const friendList = ref<IFriend[]>([])

onMounted(async () => {
  friendList.value = await friendStore.getAllFriends()
})

const showUserProfile = async (username: string) => {
  const user = await friendStore.getUserInfos(username)
  modalStore.loadAndDisplay(TheModal, UserInformations, { user: user })
}
</script>

<style scoped lang="scss">
.element_line {
  padding: 15px;

  &:hover {
    cursor: pointer;
  }
}
</style>
