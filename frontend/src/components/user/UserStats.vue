<template>
  <div class="stats">
    <LineChart v-if="userHistory" :userEloHistory="userHistory" />
  </div>
</template>

<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import type IUserStats from '@/interfaces/user/IUserStats';
import type IEloHistory from '@/interfaces/user/IEloHistory';

const userStore = useUserStore()

const userStats = ref<IUserStats | null>(null)
const userHistory = ref<IEloHistory | null>(null)

userStore.getUserStats().then((stats) => {
  userStats.value = stats
})

userStore.getEloHistory().then((history) => {
  history.dateHistory = Object.values(history.dateHistory).map(dateString => {
    const date = new Date(dateString as string);
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  });
  userHistory.value = history
})

</script>

<style scoped lang="scss">
.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;

  .chart {
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-box-shadow: inset 0px 0px 8px 5px rgba(89, 89, 89, 0.75);
    box-shadow: inset 0px 0px 8px 5px rgba(89, 89, 89, 0.75);
    border-radius: 10px;
    padding: 20px;
  }
}
</style>