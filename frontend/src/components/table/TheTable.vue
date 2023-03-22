<template>
  <section class="table_wrapper">
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in tableHeaders" :key="index">{{ header['name'] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableDataPaginated" :key="index">
          <td v-for="data in row">{{ data }}</td>
        </tr>
      </tbody>
    </table>
    <div class="table_buttons">
      <CustomButton @click="prevPage" :disabled="currentPage === 1">Prev</CustomButton>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <CustomButton @click="nextPage" :disabled="currentPage === totalPages">Next</CustomButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CustomButton from '@/components/CustomButton.vue';

const props = defineProps<{
  data: object[],
  headers: object,
  rowsPerPage?: number,
}>()

const tableData = props.data;
const tableHeaders = props.headers;
const currentPage = ref(1);
const rowsPerPage = props.rowsPerPage ?? 5;

const totalPages = computed(() => {
  return Math.ceil(tableData.length / rowsPerPage)
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const tableDataPaginated = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return tableData.slice(start, end);
});
</script>

<style scoped lang="scss">
.table_wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  grid-area: $main;

  .table_buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

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
