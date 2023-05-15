<template>
  <section class="view_wrapper">
    <section class="view_header">
      <h2
          v-for="source in friendListsSources"
          :key="source.id"
          @click="selectList(source.name)"
          :class="[selectedList === source.name ? '' : 'not_selected']"
      >
        {{ source.name }}
      </h2>
    </section>
    <div class="friends_content">
      <FriendList v-if="selectedList === 'Friends'"/>
      <RequestList v-else/>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FriendList from '@/components/user/FriendList.vue'
import RequestList from '@/components/user/RequestList.vue'

const selectedList = ref('Friends')

const friendListsSources = ref({
  friendList: {
    name: 'Friends',
    id: 'public',
  },
  requestList: {
    name: 'Requests',
    id: 'public',
  },
})

const selectList = (listID: string) => {
  selectedList.value = listID
}
</script>

<style scoped lang="scss">
.view_wrapper {

    h2:hover {
      cursor: pointer;
    }

    .not_selected {
      transition: color 0.2s ease-in-out;
      color: $secondary;
    }

    svg {
      height: 50%;
      position: absolute;
      left: 10px;
      top: calc(50% - 10px);
      cursor: pointer;
    }
  }

  .friends_content {
    height: 100%;
    width: 100%;
    overflow: auto;
}
</style>