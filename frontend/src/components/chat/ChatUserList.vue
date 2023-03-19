<template>
  <h2>{{ props.header }}</h2>
  <section class="list-wrapper">
    <ChatUserDetails v-for="userChat in userList"
                     :userChat="userChat"
                     :is-active="isActive[userChat.user.id] ??= false"
                     @setActive='setActiveUser(userChat)'
                     @setInactive='setInactiveUser(userChat)'
    />
  </section>
</template>

<script setup lang="ts">
import ChatUserDetails from '@/components/chat/ChatUserDetails.vue'
import type IUserChat from '@/interfaces/user/IUserChat';
import { defineProps, onUpdated, ref } from 'vue'

const props = defineProps<{
  userList: IUserChat[],
  header: string,
}>()

// Dictionary where key is the userId and the value is a boolean
var isActive = ref({});

onUpdated(() => {

      props.userList.forEach((userChat: IUserChat)=> {
        isActive.value[userChat.user.id] = false;
      })
});

function setActiveUser(userChat: IUserChat) {
    console.log("setActive: " + userChat.user.username);
    props.userList.forEach((userChat: IUserChat)=> {
        isActive[userChat.user.id] = false;
        })
    if (userChat)
        isActive[userChat.user.id] = true;
}

function setInactiveUser(userChat: IUserChat) {
    isActive[userChat.user.id] = false;
}

</script>

<style scoped lang="scss">
.list-wrapper {
  display: flex;
  width: 100%;
  flex-grow: 1;
  gap: 7px;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: visible;
}

h2 {
  color: $yellow;
  width: 100%;
  text-align: center;
  padding: 10px 0 10px 0;

  &:after{
    content:'';
    display: inline-block;
    width:75%;
    border-bottom:1px solid $yellow;
  }
}
</style>
