<template>
  <div class="chat-input-container">
    <input type="text" placeholder="Type a message..." class="chat-input">
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
#chat {
  .chat-input-container {
    display: flex;
    align-items: center;
    border-top: 1px solid rgb(255, 221, 1);
    padding: 10px;
  }
  .chat-input {
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
