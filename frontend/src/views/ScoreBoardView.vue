<template>
  <TheTable :rowsPerPage="8" :data="tableData" :headers="tableHeader"></TheTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import TheTable from "@/components/table/TheTable.vue"

const tableData = ref([
  { player: 'Togy', score: '69k', date: '100000' },
  { player: 'Doggy', score: '129k', date: '50000' },
  { player: 'Yvanoff', score: '1232k', date: '12.02.2020' },
  { player: 'Xx_Jsonman_xX', score: '332k', date: '12.02.2020' },
  { player: 'Alain_Chabat', score: '13k', date: '12.02.2020' },
  { player: 'Maman', score: '12k', date: '12.02.2020' },
  { player: 'UWUWUWUWUW', score: '12k', date: '12.02.2020' },
  { player: 'UWUWUWUWUW', score: '222k', date: '12.02.2020' },
  { player: 'UWUWUWUWUW', score: '12k', date: '12.02.2020' },
  { player: 'UWUWUWUWUW', score: '12k', date: '12.02.2020' },
  { player: 'UWUWUWUWUW', score: '12k', date: '12.02.2020' },
])

const tableHeader = ref([
  { name: 'Player' },
  { name: 'Score' },
  { name: 'Date' },
])
</script>

<style scoped lang="scss">

</style>
