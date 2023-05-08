<template>
	<div class="doughnut_chart chart">
		<Doughnut :data="data" :options="options"/>
	</div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import type IUserStats from '@/interfaces/user/IUserStats';

ChartJS.register(ArcElement, Tooltip, Legend)
const props = defineProps<{
	userStats: IUserStats
}>()

const lostGames = props.userStats.playedGames - props.userStats.wonGames

const data = {
	labels: ['Lost Games', 'Won Games'],
	datasets: [
		{
			backgroundColor: ['#393E46', '#00ADB5'],
			data: [lostGames, props.userStats.wonGames],
			borderWidth: 0,
		}
	],
}

const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: true,
			text: 'Games',
			color: '#EEEEEE',
			font: {
				size: 20,
			}
		},
		tooltip: {
			enabled: true,
		},
	}
}
</script>

<style scoped lang="scss">
.doughnut_chart {
	min-width: 10%;
	min-height: 10%;
}
</style>