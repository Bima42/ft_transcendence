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
import UserActions from '@/components/chat/UserActions.vue';
import { useModalStore } from '@/stores/modal';

const modalStore = useModalStore()
const friendStore = useFriendStore()

const friendList = await friendStore.getAllFriends()

const showUserProfile = async (username: string) => {
  const user = await friendStore.getUserInfos(username)
  modalStore.loadAndDisplay(TheModal, UserActions, { user: user })
}
</script>

<style scoped lang="scss">
.element_line {
  border-bottom: 1px solid $tertiary;
  border-top: 1px solid $tertiary;
  background-color: $secondary;
  
  &:hover {
    cursor: pointer;
  }
}
</style>