<template>
    <section v-if="user" class="profile_wrapper">
        <section class="profile_wrap">
			<div class="user_settings">
				<UserPicture :url="user?.avatar" :type="'big'" :status="user.status" :isSelf="isSelf" :pictureDotSize="'large'" />
				<div class="buttons_wrap">
					<h2 v-if="!isSelf">{{ user?.username }}</h2>
					<UserCredentialsSettings v-if="isSelf" />
					<UserInteractions v-else :invitePlay="true" :targetUser="user" />
				</div>
			</div>
			<div class="user_progression_bar score_card">
				<UserStatsResume :targetUser="user"/>
			</div>
        </section>
        <section class="scores_wrap">
          <UserStats :targetUser="user" />
        </section>
    </section>
</template>

<script setup lang="ts">
import UserPicture from '@/components/avatar/UserPicture.vue'
import UserCredentialsSettings from '@/components/user/UserCredentialsSettings.vue'
import UserStats from '@/components/user/UserStats.vue';
import { useUserStore } from '@/stores/user';
import UserStatsResume from '@/components/user/UserStatsResume.vue';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import type IUser from '@/interfaces/user/IUser';
import UserInteractions from '@/components/user/UserInteractions.vue';

const userStore = useUserStore()
const route = useRoute()

const user = ref<IUser | null>()
const isSelf = ref(true)

function loadUser() {
	if (route.params.id) {
		isSelf.value = false
		userStore.getUserInfos(route.params.id as string).then((userData) => {
			user.value = userData
		})
	}
	else {
		isSelf.value = true
		user.value = userStore.user
	}
}

watch(() => route.params, () => {loadUser()})
watch(() => userStore.user, () => {loadUser()})

loadUser()
</script>

<style scoped lang="scss">
.profile_wrapper {
    grid-area: $bigmain;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 5px;
    gap: $medium_gap;

	.buttons_wrap {
		display: flex;
		gap: $small_gap;
		flex-direction: column;
		justify-content: center;
	}

    .profile_wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
		gap: $small_gap;

		.user_settings, .user_progression_bar {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
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
		height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
		gap: $medium_gap;
    }
}
</style>