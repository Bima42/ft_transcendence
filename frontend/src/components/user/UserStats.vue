<template>
	<LineChart v-if="userEloHistory" :userEloHistory="userEloHistory" />
	<div class="match_history score_card">
		<h2>Match History</h2>
		<TheTable v-if="userMatchHistory" :data="userMatchHistory" :headers="tableHeaders" :rowsPerPage="4" :callback="handleProfileClick"/>
	</div>
</template>

<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue'
import { useUserStore } from '@/stores/user'
import { ref, watch } from 'vue'
import type IUserStats from '@/interfaces/user/IUserStats'
import type IEloHistory from '@/interfaces/user/IEloHistory'
import type IMatchHistory from '@/interfaces/user/IMatchHistory'
import TheTable from '@/components/table/TheTable.vue'
import type IUser from '@/interfaces/user/IUser'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useAlertStore } from '@/stores/alert'

const props = defineProps<{
	targetUser: IUser,
}>()

const userStore = useUserStore()
const router = useRouter()
const alertStore = useAlertStore()
const modalStore = useModalStore()

const userStats = ref<IUserStats | null>(null)
const userEloHistory = ref<IEloHistory | null>(null)
const userMatchHistory = ref<IMatchHistory[] | null>(null)

const handleProfileClick = (userName: string) => {
	if (userName === '') return
	userStore.getUserInfosByUsername(userName).then((res) => {
		if (res.id === userStore.user?.id)
			router.push('/main/profile')
		else
			router.push(`/main/profile/${res.id}`)
		modalStore.resetState()
	}).catch((err) => {
		alertStore.setErrorAlert(err)
	})
}

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
    background: $background;

	h2 {
		font-size: 20px;
		margin-bottom: 10px;
	}
}
</style>
