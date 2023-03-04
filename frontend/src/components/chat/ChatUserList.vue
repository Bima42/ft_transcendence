<template>
  <h2>{{ props.header }}</h2>
  <section class="list-wrapper">
    <ChatUserDetails v-for="user in userList"
                     :user="user"
                     :is-active="user.isActive"
                     @setActive='setActiveUser(user)'
                     @setInactive='setInactiveUser(user)'
    />
  </section>
</template>

<script setup lang="ts">
import ChatUserDetails from '@/components/chat/ChatUserDetails.vue'
import { defineProps } from 'vue'

const props = defineProps<{
  userList: object,
  header: string,
}>()

function setActiveUser(user: object) {
  props.userList.forEach(user => {
    user.isActive = false
  })
  user.isActive = true
}

function setInactiveUser(user: object) {
  user.isActive = false
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