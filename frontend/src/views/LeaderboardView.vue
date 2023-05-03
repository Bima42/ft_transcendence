<template>
  <section class="view_wrapper">
    <section class="view_header">
      <h2>
        Leaderboard
      </h2>
    </section>
    <LeaderboardTable :headers="tableHeaders" :data="datas" :sortDatas="sortDatas"/>
  </section>
</template>

<script setup lang="ts">
import LeaderboardTable from '@/components/table/LeaderboardTable.vue'
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import type IUserStats from '@/interfaces/user/IUserStats';

const userStore = useUserStore()

const datas = ref<IUserStats[]>([])

onMounted(async () => {
  datas.value = await userStore.getLeaderboard()
})

const sortDatas = (header: string) => {
  if (header == 'Username') {
    datas.value.sort((a, b) => {
      return a.username.localeCompare(b.username)
    })
  } else if (header == 'Winrate') {
    datas.value.sort((a, b) => {
      return b.winRate - a.winRate
    })
  } else if (header == 'Games') {
    datas.value.sort((a, b) => {
      return b.playedGames - a.playedGames
    })
  } else if (header == 'Elo') {
    datas.value.sort((a, b) => {
      return b.elo - a.elo
    })
  }
}

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
</script>

<style scoped lang="scss">

</style>