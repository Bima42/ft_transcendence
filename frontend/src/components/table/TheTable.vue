<template>
  <section class="table-wrapper">
    <h1>LIVE GAME</h1>
    <table>
      <thead>
      <tr>
        <th class="text"><h1>OPPONENTS</h1></th>
        <th class="text"><h1>SCORE</h1></th>
        <th class="text"><h1>POPULATION</h1></th>
        <th class="text"><h1>LIVE GAME</h1></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text">User 33</td>
        <td class="text">2 - 1</td>
        <td class="text">4000</td>
        <td class="text">
          <CustomButton> Watch now!</CustomButton>
        </td>
      </tr>
      <tr>
<!--      <tr v-for="n in 20">-->
      <td class="text">User 209</td>
        <td class="text">33 - 40</td>
        <td class="text">3300</td>
        <td class="text">
          <CustomButton> Watch now!</CustomButton>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
</script>

<style scoped lang="scss">
.table-wrapper {
  grid-area: $main;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  table {
    tr {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-top: 1px solid rgb(239, 173, 5);
      border-bottom: 1px solid rgb(245, 221, 4);
      margin: 10px;
      text-align: center;
      transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

      .text {
        width: 138px;
        padding: 10px;
        margin: 10px;
        text-align: center;
        transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

        h1 {
          font-weight: bolder;
          color: rgb(255, 217, 0);
        }
      }
    }

    tbody tr:hover {
      background: rgba(214, 177, 8, 0.522);
      box-shadow: 0 0 10px 5px rgba(200, 0, 200, 0.5);
    }
  }
}
</style>
