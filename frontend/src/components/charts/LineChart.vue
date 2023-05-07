<template>
  <div class="line_chart score_card">
    <Line :data="data" :options="options"/>
  </div>
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'vue-chartjs'
import type IEloHistory from '@/interfaces/user/IEloHistory';

const props = defineProps<{
  userEloHistory: IEloHistory
}>()

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)


const data = {
  labels: props.userEloHistory.dateHistory,
  datasets: [
    {
      backgroundColor: '#00ADB5',
      borderColor: '#00ADB5',
      pointRadius: 4,
      data: props.userEloHistory.eloHistory
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: '#EEEEEE'
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        color: '#EEEEEE'
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Elo Progression',
      color: '#EEEEEE',
      font: {
        size: 20,
      },
    },
    legend: {
      display: false
    }
  }
}
</script>

<style scoped lang="scss">
.line_chart {
	width: 100%;
	min-height: 50%;
}
</style>