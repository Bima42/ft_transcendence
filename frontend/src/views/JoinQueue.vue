<template>

    <div id="wrapper">

        <GameSettings></GameSettings>
        <CustomButton id="join_btn" @click="joinQueue">
            {{ isLoading ? 'Abort' : 'Join queue' }}
        </CustomButton>
        <LoadingGame v-if="isLoading"></LoadingGame>
    </div>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import CustomButton from '@/components/CustomButton.vue'
import GameSettings from '@/components/game/GameSettings.vue'
import LoadingGame from '@/components/game/LoadingGame.vue';

const isLoading = ref(false)

function joinQueue() {
    isLoading.value = !isLoading.value
}

</script>

<style scoped lang="scss">
#wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    grid-area: $main;
}

#join_btn {
    font-size: 20px;
    margin-bottom: 20px;
}
</style>