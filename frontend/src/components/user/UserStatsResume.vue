<template>
	<div class="user_winrate">
		<h2>Winrate</h2>
		<ProgressBars :stats="winRateStat" :text="winRateText"/>
	</div>
	<div class="user_elo">
		<h2>Elo</h2>
		<ProgressBars :stats="eloStat" :text="eloText"/>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import ProgressBars from '@/components/charts/ProgressBars.vue';
import type IUserStats from '@/interfaces/user/IUserStats';

const userStore = useUserStore()
const userStats = ref<IUserStats | null>(null)
const winRateStat = ref<number | null>(null)
const winRateText = ref<string | null>(null)

const highestElo = ref<number | null>(null)
const eloStat = ref<number | null>(null)
const eloText = ref<string | null>(null)

userStore.getHighestElo().then((elo) => {
	highestElo.value = elo
})

userStore.getUserStats().then((stats) => {
	userStats.value = stats
	winRateStat.value = stats.winRate
	winRateText.value = `${stats.winRate}%`
	eloText.value = `${stats.elo} Points`

	if (highestElo.value === null) return
	eloStat.value = stats.elo * 100 / highestElo.value
})
</script>

<style scoped lang="scss">
.user_elo, .user_winrate {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: $medium_gap;
}
</style>