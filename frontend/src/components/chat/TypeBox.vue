<template>
  <div class="chat-input-container">
    <input type="text" placeholder="Type a message...">
    <CustomButton @click="sendMessage">Send</CustomButton>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'

function sendMessage() {
  console.log('Message sent :)')
}
</script>

<style scoped lang="scss">
.chat-input-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;

  input {
    flex: 1;
    height: 30px;
    border: 1px solid yellow;
    background-color: rgb(49, 49, 47);
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 5px;
    color: white;
  }
}
</style>
