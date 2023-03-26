<template>
    <section class="left-wrap">
        <UserAvatar type="big"/>
        <UsernameInput/>
    </section>
    <section class="right-wrap">
        <UserHighestScore></UserHighestScore>
    </section>
</template>

<script setup lang="ts">
import {useModalStore} from '@/stores/modal'
import UserAvatar from '@/components/multiusage/UserAvatar.vue'
import UserHighestScore from '@/components/modal/useredit/UserHighestScore.vue'
import UsernameInput from '@/components/modal/useredit/UsernameInput.vue';

const modalStore = useModalStore()
const data = modalStore.data.data
</script>

<style scoped lang="scss">
.left-wrap {
    display: flex;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.right-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
}
</style>