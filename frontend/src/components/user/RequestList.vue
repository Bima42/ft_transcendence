<template>
  <div class="element_line" v-for="user in requests" @click="showUserProfile(friend.username)">
    <UserPicture :type="'small'" :url="user.avatar" />
    <h3>{{ user.username }}</h3>
    <div class="user_decisions">
      <font-awesome-icon icon="fa-check" color="green" size="xl" @click="acceptRequest(user.username)"/>
      <font-awesome-icon icon="fa-xmark" color="red" size="xl" @click="declineRequest(user.username)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFriendStore } from '@/stores/friend';
import TheModal from '@/components/modal/TheModal.vue';
import UserActions from '@/components/chat/UserActions.vue';
import { useModalStore } from '@/stores/modal';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import UserPicture from '@/components/avatar/UserPicture.vue';

const modalStore = useModalStore()
const friendStore = useFriendStore()

const requests = await friendStore.getAllPendingRequests()
const showUserProfile = async (username: string) => {
  const user = await friendStore.getUserInfos(username)
  modalStore.loadAndDisplay(TheModal, UserActions, { user: user })
}

const acceptRequest = async (username: string) => {
  await friendStore.acceptFriendRequest(username)
  window.location.reload()
}

const declineRequest = async (username: string) => {
  await friendStore.declineFriendRequest(username)
  window.location.reload()
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

  .user_decisions {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
</style>