<template>
	<LineChart v-if="userEloHistory" :userEloHistory="userEloHistory" />
	<Table v-if="userMatchHistory" :data="userMatchHistory" :headers="tableHeaders" />
</template>

<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import type IUserStats from '@/interfaces/user/IUserStats';
import type IEloHistory from '@/interfaces/user/IEloHistory';
import type IMatchHistory from '@/interfaces/user/IMatchHistory';
import Table from '@/components/table/Table.vue';

const userStore = useUserStore()

const userStats = ref<IUserStats | null>(null)
const userEloHistory = ref<IEloHistory | null>(null)
const userMatchHistory = ref<IMatchHistory[] | null>(null)

onMounted(() => {
	userStore.getUserStats().then((stats) => {
		userStats.value = stats
	})

	userStore.getEloHistory().then((history) => {
		userEloHistory.value = history
	})

	userStore.getMatchHistory().then((history) => {
		userMatchHistory.value = history
	})

})

const tableHeaders = {
	opponent: {
		name: 'Opponent'
	},
	result: {
		name: 'Result'
	},
	score: {
		name: 'Score'
	},
	date: {
		name: 'Date'
	}
}

</script>

<style scoped lang="scss">

</style>