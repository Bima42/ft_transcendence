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
  Tooltip,
type ChartData
} from 'chart.js';
import { Line } from 'vue-chartjs'
import type IEloHistory from '@/interfaces/user/IEloHistory';
import { watch } from 'vue';

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

let data: ChartData<"line">
let options = {}

function loadStuff() {
	data = {
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

	options = {
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
					family: 'Martian Mono',
					size: 20,
				},
			},
			legend: {
				display: false
			}
		}
	}
}
loadStuff()
watch(() => props.userEloHistory, () => loadStuff())
</script>

<style scoped lang="scss">
.line_chart {
    max-width: 600px;
    max-height: 400px;
	width: 100%;
	height: 100%;
}
</style>
