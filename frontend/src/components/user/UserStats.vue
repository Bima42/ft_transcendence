<template>
  <div class="stats">
    <Doughnut :data="doughnutData" :options="doughnutOptions" />
<!--    <Line :data="lineData" :options="lineOptions" />-->
  </div>

</template>

<script setup lang="ts">
import type IUserStats from '@/interfaces/user/IUserStats';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'

const props = defineProps<{
  userStats: IUserStats
}>()

ChartJS.register(ArcElement, Tooltip, Legend)
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const lostGames = props.userStats.playedGames - props.userStats.wonGames

const doughnutData = {
  labels: ['Games Lost', 'Games Won'],
  datasets: [
    {
      backgroundColor: ['#393E46', '#00ADB5'],
      data: [lostGames, props.userStats.wonGames]
    }
  ]
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false
}

// const lineData = {
//   labels: ['April', 'May', 'June', 'July'],
//   datasets: [
//     {
//       label: 'Elo Progression',
//       backgroundColor: '#00ADB5',
//       data: props.userStats.eloHistory
//     }
//   ]
// }
//
// const lineOptions = {
//   responsive: true,
//   maintainAspectRatio: false
// }
</script>

<style scoped lang="scss">
.stats {
  display: flex;
  flex-direction: column;
  max-width: 90vw;
  max-height: 40vh;
}
</style>