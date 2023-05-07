<template>
    <section class="settings_wrapper">
        <section class="profile_wrap">
			<div class="user_settings">
				<UserPicture :url="userStore.user?.avatar" :type="'big'"/>
				<UserCredentialsSettings/>
			</div>
			<div class="user_progression_bar score_card">
				<UserStatsResume/>
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
import UserStatsResume from '@/components/user/UserStatsResume.vue';

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.settings_wrapper {
    grid-area: $bigmain;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    padding: 5px;
    gap: $medium_gap;

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
			gap: $medium_gap;
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
        flex-direction: column;
    }
}
</style>