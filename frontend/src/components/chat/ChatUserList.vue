<template>
  <div class="chat-sidebar">
    <div class="section-a">
      <p>Online Friends</p>
      <p v-for="guy in dummy">{{ guy.name }}</p>
    </div>
    <div class="section-a">
      <p>Pepole in the room</p>
      <p v-for="guy in dummy">{{ guy.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const dummy = ref(
    [
      {
        name: 'Bima',
      },
      {
        name: 'Mabi',
      },
      {
        name: 'Te',
      },
    ]
)

</script>

<style scoped lang="scss">
.chat-sidebar {
  width: 25%;
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .section-a {
    display: flex;
    width: 100%;
    flex-grow: 1;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
  }
}

</style>
