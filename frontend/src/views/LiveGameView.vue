<template>
<!--  <TheTable></TheTable>-->
  <TheTablev3 :data="tableData"></TheTablev3>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import TheTable from "@/components/table/TheTable.vue"
import TheTablev3 from "@/components/table/TheTablev3.vue"

const tableData = ref([
  { opponent: 'Team A', score: 10, population: 100000, live: true, game: 'Game 1' },
  { opponent: 'Team B', score: 5, population: 50000, live: false, game: 'Game 2' },
  { opponent: 'Team C', score: 8, population: 80000, live: true, game: 'Game 3' },
  { opponent: 'Team D', score: 3, population: 30000, live: false, game: 'Game 4' }
])
</script>

<style scoped lang="scss">

</style>
