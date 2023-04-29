<template>
    <section class="settings_wrapper">
        <section class="profile_wrap">
            <div class="user_avatar_wrap">
                <UserPicture
                    :url="userStore.user?.avatar"
                    :type="'big'"
                />
                <UploadAvatarButtons/>
            </div>
            <div class="user_credentials">
                <UserCredentialsSettings/>
            </div>
        </section>
        <section class="scores_wrap">
            <UserHighestScore/>
        </section>
    </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useUserStore } from '@/stores/user'
import UserPicture from '@/components/avatar/UserPicture.vue'
import UserHighestScore from '@/components/user/UserHighestScore.vue'
import UploadAvatarButtons from '@/components/avatar/UploadAvatarButtons.vue'
import UserCredentialsSettings from '@/components/user/UserCredentialsSettings.vue'

const userStore = useUserStore()

const props = defineProps<{}>()
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

    .profile_wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;

        .user_credentials {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 50%;
        }
    }

    .user_avatar_wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        width: 50%;
    }

    .scores_wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 20px;
    }
}
</style>