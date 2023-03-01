<template>
  <section class="table_wrapper">
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in tableHeaders" :key="index">{{ header.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
          <td v-for="data in row">{{ data }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: object,
  headers: object,
}>()

const tableData = props.data;
const tableHeaders= props.headers;

</script>

<style scoped lang="scss">
.table_wrapper {
  display: flex;
  width: 100%;
  justify-content: center;
  grid-area: $main;

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #000;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    margin: 20px auto;
    font-size: 0.9em;
    font-family: sans-serif;
    line-height: 1.5;
    text-align: center;

    thead tr {
      background-color: $yellow;
      color: black;
    }

    th,
    td {
      padding: 12px 15px;
    }

    tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    tbody tr:nth-of-type(even) {
      background-color: $lighter-gray;
    }

    tbody tr:last-of-type {
      border-bottom: 2px solid $yellow;
    }
  }
}

</style>