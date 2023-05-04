<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">

import type IUserStats from '@/interfaces/user/IUserStats';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

const props = defineProps<{
    userStats: IUserStats
}>()

ChartJS.register(ArcElement, Tooltip, Legend)
const lostGames = props.userStats?.playedGames - props.userStats?.wonGames

const chartData = {
  labels: ['Games Lost', 'Games Won'],
  datasets: [
    {
      backgroundColor: ['#393E46', '#00ADB5'],
      data: [lostGames, props.userStats?.wonGames]
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<style scoped lang="scss">

</style>