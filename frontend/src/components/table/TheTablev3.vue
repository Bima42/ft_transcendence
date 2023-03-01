<template>
  <section class="table_wrapper">
    <table>
      <thead>
        <tr>
          <th>Opponent</th>
          <th>Score</th>
          <th>Population</th>
          <th>Live</th>
          <th>Game</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
          <td>{{ row.opponent }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.population }}</td>
          <td>{{ row.live }}</td>
          <td>{{ row.game }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: object,
}>()

const tableData = props.data;

</script>

<style scoped lang="scss">
.table_wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  grid-area: $main;
}

</style>