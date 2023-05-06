<template>
    <section class="settings_wrapper">
        <section class="profile_wrap">
			<div class="user_settings">
				<UserPicture :url="userStore.user?.avatar" :type="'big'"/>
				<UserCredentialsSettings/>
			</div>
			<div class="user_progression_bar">
				<ProgressionsBar :stats="winRateStat" :text="winRateText"/>
				<ProgressionsBar :stats="eloStat" :text="eloText"/>
			</div>
        </section>
        <section class="scores_wrap">
          <UserStats/>
        </section>
    </section>
</template>

<script setup lang="ts">
import UserPicture from '@/components/avatar/UserPicture.vue'
import UserCredentialsSettings from '@/components/user/UserCredentialsSettings.vue'
import UserStats from '@/components/user/UserStats.vue';
import { useUserStore } from '@/stores/user';
import ProgressionsBar from '@/components/charts/ProgressBars.vue';
import { ref } from 'vue';
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
	console.log(eloStat.value)
})

</script>

<style scoped lang="scss">
.settings_wrapper {
    grid-area: $bigmain;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    padding: 5px;
    gap: 20px;

    .profile_wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

		.user_settings, .user_progression_bar {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 20px;
			width: 50%;
		}

		.user_progression_bar {
			flex-wrap: wrap;
			justify-content: space-evenly;
		}
    }

    .scores_wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
}
</style>