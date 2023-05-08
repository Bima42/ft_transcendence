<template>
	<LineChart v-if="userEloHistory" :userEloHistory="userEloHistory" />
	<div class="match_history score_card">
		<h2>Match History</h2>
		<Table v-if="userMatchHistory" :data="userMatchHistory" :headers="tableHeaders" />
	</div>
</template>

<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue';
import { useUserStore } from '@/stores/user';
import { ref, watch } from 'vue';
import type IUserStats from '@/interfaces/user/IUserStats';
import type IEloHistory from '@/interfaces/user/IEloHistory';
import type IMatchHistory from '@/interfaces/user/IMatchHistory';
import Table from '@/components/table/Table.vue';
import type IUser from '@/interfaces/user/IUser';

const props = defineProps<{
	targetUser: IUser,
}>()
const userStore = useUserStore()

const userStats = ref<IUserStats | null>(null)
const userEloHistory = ref<IEloHistory | null>(null)
const userMatchHistory = ref<IMatchHistory[] | null>(null)

function loadStuff() {
	userStore.getUserStats(props.targetUser.id).then((stats) => {
		userStats.value = stats
	})

	userStore.getEloHistory(props.targetUser.id).then((history) => {
		userEloHistory.value = history
	})

	userStore.getMatchHistory(props.targetUser.id).then((history) => {
		userMatchHistory.value = history
	})
}

loadStuff()
watch(() => props.targetUser, () => loadStuff())

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
.match_history {
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: $small_gap;

	h3 {
		font-size: 20px;
	}
}
</style>
