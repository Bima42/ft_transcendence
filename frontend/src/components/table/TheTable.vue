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
      <tr v-if="currentPage === 1">
        <td class="text">User page 1</td>
        <td class="text">2 - 1</td>
        <td class="text">4000</td>
        <td class="text">
          <CustomButton> Watch now!</CustomButton>
        </td>
      </tr>
      <tr v-if="currentPage === 2">
<!--      <tr v-for="n in 20">-->
      <td class="text">User page 2</td>
        <td class="text">33 - 40</td>
        <td class="text">3300</td>
        <td class="text">
          <CustomButton> Watch now!</CustomButton>
        </td>
      </tr>
      <tr v-if="currentPage === 3">
        <td class="text">User page 3</td>
        <td class="text">2 - 1</td>
        <td class="text">4000</td>
        <td class="text">
          <CustomButton> Watch now!</CustomButton>
        </td>
      </tr>
      </tbody>
    </table>
    <div><button @click1="show1">page 1</button> <button @click="show2">page 2</button> <button @click="show3">page 3</button></div> 
  </section>
</template>

<script lang="ts">
// import CustomButton from '@/components/CustomButton.vue'

export default {
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    show1: function() {
      this.currentPage = 1,
      this.currentPage != 2,
      this.currentPage != 3
    },
    show2: function() {
      this.currentPage != 1,
      this.currentPage = 2,
      this.currentPage != 2
    },
    show3: function() {
      this.currentPage != 1,
      this.currentPage != 2,
      this.currentPage = 3
    }
  }
}

</script>

<style scoped lang="scss">

button {
  border-radius: 16px;
  background: $yellow;
  padding: 5px 12px;
  border: none;

  &:hover {
    cursor: pointer;
    filter: hue-rotate(180deg);
  }

  &.fat {
    font-weight: 900;
  }
}

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
