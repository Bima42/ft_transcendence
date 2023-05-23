<template>
	<section class="view_wrapper">
		<section class="view_header">
			<h2>
				Leaderboard
			</h2>
		</section>
		<TheTable :headers="tableHeaders" :data="datas" :sortDatas="sortDatas" :rowsPerPage="11" :callback="handleProfileClick"/>
	</section>
</template>

<script setup lang="ts">
import TheTable from '@/components/table/TheTable.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import type IUserStats from '@/interfaces/user/IUserStats'
import { roundValue } from '../../utils'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
const modalStore = useModalStore()
const userStore = useUserStore()
const router = useRouter()

const datas = ref<IUserStats[]>([])

function loadDatas() {
	userStore.getLeaderboard().then((leaderboard) => {
		leaderboard.forEach((user) => {
			user.winRate = roundValue(user.winRate, 1)
			user.averageScore = roundValue(user.averageScore, 1)
		})
		datas.value = leaderboard
	})
}

loadDatas()

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

let ascendSort = 1
const sortDatas = (header: string) => {
	ascendSort *= -1
	if (header == 'Username') {
		datas.value.sort((a, b) => {
			return ascendSort * a.username.localeCompare(b.username)
		})
	} else if (header == 'Winrate') {
		datas.value.sort((a, b) => {
			return ascendSort * ( b.winRate - a.winRate)
		})
	} else if (header == 'Games') {
		datas.value.sort((a, b) => {
			return ascendSort * (b.playedGames - a.playedGames)
		})
	} else if (header == 'Average Score') {
		datas.value.sort((a, b) => {
			return ascendSort * (b.averageScore - a.averageScore)
		})
	} else if (header == 'Elo') {
		datas.value.sort((a, b) => {
			return ascendSort * (b.elo - a.elo)
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
.view_wrapper {
    grid-area: $gigamain;
}
</style>
