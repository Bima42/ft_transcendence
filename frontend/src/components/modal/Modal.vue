<template>
  <div>
    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
              <h1 class="title">Create a new channel</h1>
              <p class="description">Here you can create a new channel, please fill the following info :</p>
                <div class="chat-input-container">
                  <div><input type="text" placeholder="Please, chose the name of the channel" class="chat-input"></div>
                  <div><input type="text" placeholder="Set Password" class="chat-input"></div>
                  <div><input type="text" placeholder="Confirm Password" class="chat-input"></div>
                  <div><input type="text" placeholder="Invite users to the channel" class="chat-input"></div>
                  <div class="radio-buttons">
                    <label><input type="radio" name="type" value="private">Private</label>
                    <label><input type="radio" name="type" value="public">Public</label>
                  </div>
                  <CustomButton>Create</CustomButton>
                  <CustomButton>Quit</CustomButton>

                </div>
          </div>
        </div>
      </div>
    </transition>
    <button @click="isOpen = !isOpen;">
      {{ isOpen ? "Close" : "Create a new channel" }}
    </button>
  </div>
</template>
<script setup lang="ts">
	import CustomButton from '@/components/CustomButton.vue'
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

<style scoped>
.Custom.Button {
  display: inline-block;
}
.radio-buttons {
  display: flex;
  justify-content: space-between;
  font-size: 1em;
  color: rgb(255, 179, 0);
  margin: 10px;
  padding: 10px;
}

.title{
  font-size: 2em;
  font-weight: bold;
  color: rgb(255, 179, 0);
  text-align: center;
}

.description {
  font-size: 1em;
  font-weight: normal;
  color: #666;
  text-align: justify;
}
	.chat-input-container {
    display: flex;
    flex-direction: column; /*aligns items vertically*/
		position: relative;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		padding: 10px;
	}
	.chat-input {
    color: rgb(255, 200, 0);
		flex: 1;
		height: 30px;
    width: 450px;
		border: 1px solid rgb(255, 204, 0);
		background-color: rgb(49, 49, 47);
		border-radius: 5px;
		padding: 0 10px;
		margin-right: 5px;
    margin-top: 20px;
	}
.modal {
  width: 500px;
  height: 600px;
  margin: 0px auto;
  padding: 20px;
  background-color: rgb(56, 53, 53);
  border-radius: 2px;
  box-shadow: 0 20px 30px rgba(211, 2, 214, 0.644);
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}
button {
  padding: 7px;
  margin-top: 10px;
  background-color: rgb(255, 230, 0);
  color: rgb(0, 0, 0);
  font-size: 1.1rem;
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
  background: #000000da;
  z-index: 999;
  transition: opacity 0.2s ease;
}
</style>
