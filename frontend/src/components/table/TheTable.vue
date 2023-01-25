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
        <button> Watch now!</button>
        </td>
      </tr>
      <tr v-if="currentPage === 2">
        <td class="text">User page 2</td>
        <td class="text">33 - 40</td>
        <td class="text">3300</td>
        <td class="text">
        <button> Watch now!</button>
        </td>
      </tr>
      <tr v-if="currentPage === 3">
        <td class="text">User page 3</td>
        <td class="text">12 - 71</td>
        <td class="text">345</td>
        <td class="text">
        <button> Watch now!</button>
        </td>
      </tr>
      <tr v-if="currentPage === 4">
        <td class="text">User page 4</td>
        <td class="text">5 - 21</td>
        <td class="text">7668</td>
        <td class="text">
        <button> Watch now!</button>
        </td>
      </tr>
      <tr v-if="currentPage === 5">
        <td class="text">User page 5</td>
        <td class="text">7 - 14</td>
        <td class="text">8500</td>
        <td class="text">
        <button> Watch now!</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-bind:style="{ 'grid-template-columns': 'repeat(' + nbrGlobal + ', 1fr)' }">
      <button v-on:click="currentPage > 1 ? currentPage-- : ''">Prev</button> 
      <button v-for="nbr in nbrTotal" v-bind:class="{ 'selected': currentPage === nbr }" @click="currentPage=nbr">page {{nbr}}</button> 
      <!-- <button v-bind:class="{ 'selected': currentPage === 2 }" @click="currentPage=2">page 2</button> 
      <button v-bind:class="{ 'selected': currentPage === 3 }" @click="currentPage=3">page 3</button>  -->
      <button v-on:click="currentPage < nbrTotal ? currentPage++ : ''">Next</button>
    </div>
  </section>
</template>

<script lang="ts">
import CustomButton from '@/components/CustomButton.vue'

  export default {
    data() {
      return {
        currentPage: 1,
        nbr: 1,
        nbrTotal: 4,
      }
    },
    computed:{
    nbrGlobal(){
      return this.nbrTotal + 2
    }
  }
  
  }

  // let nbr = 1
  // let nbrTotal = 3
  // let nbrGlobal = 5

</script>

<style scoped lang="scss">

div {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}

button {
  border-radius: 16px;
  background: $yellow;
  padding: 5px 12px;
  border: 20px;
  
  &:hover {
    cursor: pointer;
    filter: hue-rotate(180deg);
  }

  &.fat {
    font-weight: 900;
  }
  &.selected {
  background-color: rgba(200, 0, 200, 0.5);
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
