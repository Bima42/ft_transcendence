<template>
  <section class="friends_wrapper">
    <section class="friends_header">
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
      <template :class="[selectedList === 'Friends' ? 'shown' : 'hidden']">
        <Suspense>
          <FriendList/>
        </Suspense>
      </template>
      <template :class="[selectedList === 'Requests' ? 'shown' : 'hidden']">
      <Suspense>
        <RequestList/>
      </Suspense>
    </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FriendList from '@/components/user/FriendList.vue';
import RequestList from '@/components/user/RequestList.vue';
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
.friends_wrapper {
  grid-area: $gigamain;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .friends_header {
    border-bottom: 1px solid $tertiary;
    border-top: 1px solid $tertiary;
    padding: 10px;
    width: 100%;
    text-align: center;
    position: sticky;
    display: flex;
    justify-content: center;
    gap: 20px;
    color: $quaternary;

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
}
</style>