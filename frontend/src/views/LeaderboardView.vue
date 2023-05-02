<template>
  <section class="view_wrapper">
    <section class="view_header">
      <h2>
        Leaderboard
      </h2>
    </section>
    <LeaderboardTable :headers="tableHeaders" :data="datas"/>
  </section>
</template>

<script setup lang="ts">
import LeaderboardTable from '@/components/table/LeaderboardTable.vue'
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import type IUserStats from '@/interfaces/user/IUserStats';

const userStore = useUserStore()

const datas = ref<IUserStats[]>([])

const tableHeaders = {
  user: {
    name: 'Username'
  },
  winrate: {
    name: 'Winrate'
  },
  games: {
    name: 'Games'
  },
  elo: {
    name: 'Elo'
  },
}

onMounted(async () => {
  datas.value = await userStore.getLeaderboard()
})
</script>

<style scoped lang="scss">

</style>