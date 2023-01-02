<template>
  <h2>{{ props.header }}</h2>
  <section class="list-wrapper">
    <p v-for="user in props.userList">{{ user.name }}</p>
<!--    Make the <p> clickable to pop the small card-->
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  userList: object,
  header: string,
}>()
</script>

<style scoped lang="scss">
.list-wrapper {
  display: flex;
  width: 100%;
  flex-grow: 1;
  gap: 7px;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  p {
    cursor: pointer;
    text-align: left;
  }
}

h2 {
  color: $yellow;
  width: 100%;
  text-align: center;
  padding: 10px 0 10px 0;

  &:after{
    content:'';
    display: inline-block;
    width:75%;
    border-bottom:1px solid $yellow;
  }
}
</style>