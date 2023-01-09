<template>
  <div>
    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
              <h1 class="title">Create a new channel</h1>
              <p class="description">Here you can create a new channel, please fill the following info :</p>
                <div class="chat-input-container">
                  <div><input type="text" placeholder="Chose the name of the channel" class="chat-input"></div>
                  <div><input type="text" placeholder="Set Password" class="chat-input"></div>
                  <div><input type="text" placeholder="Confirm Password" class="chat-input"></div>
                  <div><input type="text" placeholder="Invite users to the channel" class="chat-input">
                </div>
                <div class="radio-buttons">
                  <label><input type="radio" name="type" value="private">Private</label>
                  <label><input type="radio" name="type" value="public">Public</label>
                </div>
                <div class="button-container">
                  <CustomButton>Create</CustomButton>
                  <CustomButton>Quit</CustomButton>
                </div>
                </div>
          </div>
        </div>
      </div>
    </transition>
    <CustomButton @click="isOpen = !isOpen;">
      {{ isOpen ? "Create a new channel" : "Create a new channel" }}
    </CustomButton>
  </div>
</template>

<script setup lang="ts">
import {useModalStore} from "@/stores/modal";
import CustomButton from '@/components/CustomButton.vue'

const modalStore = useModalStore()
const data = modalStore.data.data
</script>

<script lang = "ts">
  export default {
    data: function() {
      return {
        isOpen: false
      };
    }
  };
</script>

<style lang="scss" scoped>

  .button-container button {
    margin: 10px;
  }

  .radio-buttons {
    color: rgb(255, 179, 0);
    margin: 10px;
    padding: 10px;
  }

  .title{
    margin-bottom: 20px;
    font-size: 2em;
    font-weight: bold;
    color: rgb(255, 179, 0);
    text-align: center;
  }

  .description {
    font-style: italic;
    color: rgb(128, 126, 126);
  }

    .chat-input-container {
      display: flex;
      flex-direction: column; /*aligns items vertically*/
      align-items: center;
      padding: 10px;
    }
    .chat-input {
      color: rgb(255, 200, 0);
      font-style: italic;
      height: 30px;
      width: 450px;
      border: 1px solid rgb(255, 204, 0);
      background-color: rgb(49, 49, 47);
      border-radius: 5px;
      padding: 0 10px; /*inside*/
      margin-top: 20px;
    }

  .modal {
    padding: 20px;
    background-color: rgb(56, 53, 53);
    border-radius: 10px;
    box-shadow: 0 20px 50px rgba(211, 2, 214, 0.644);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #000000e8;
  }
</style>
