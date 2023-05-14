<template>
  <section class="view_wrapper">
    <section class="view_header">
      <h2>
        Leaderboard
      </h2>
    </section>
    <Table :headers="tableHeaders" :data="datas" :sortDatas="sortDatas"/>
  </section>
</template>

<script setup lang="ts">
import Table from '@/components/table/TheTable.vue'
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import type IUserStats from '@/interfaces/user/IUserStats';

const userStore = useUserStore()

const datas = ref<IUserStats[]>([])
onMounted( () => {
	userStore.getLeaderboard().then((leaderboard) => {
		datas.value = leaderboard
	})
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
  } else if(header == 'Average Score') {
      datas.value.sort((a, b) => {
        return b.averageScore - a.averageScore
      })
  }
  else if (header == 'Elo') {
    datas.value.sort((a, b) => {
      return b.elo - a.elo
    })
  }
}

const tableHeaders = {
  user: {
    name: 'Username'
  },
  games: {
    name: 'Games'
  },
  winrate: {
    name: 'Winrate'
  },
  averageScore: {
    name: 'Average Score'
  },
  elo: {
    name: 'Elo'
  }
}
</script>

<style scoped lang="scss">

</style>