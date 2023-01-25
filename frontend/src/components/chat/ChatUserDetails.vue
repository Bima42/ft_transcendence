<template>
  <p @click="$emit('setActive')">
    {{ user.name }}
  <div class="user-details-panel" v-show="isActive">
    <UserAvatar type="small"/>
    Actif
    <button @click.stop="$emit('setInactive')">close</button>
    <!-- <button v-on:click="addFriend">{{ buttonName }} </button> <button>Send private msg</button> <button @click="$emit('setActive')">...</button> -->

    <div class="box">
	    <a class="button" :href="addRemove" v-on:click="buttonName == 'add friend' ? buttonName='remove' : buttonName='add friend'">{{buttonName}}</a> <a class="button" href="#popup2">Send private msg</a> <a class="button" href="#popup3">...</a>
    </div>

  </div>
  </p>

  <div id="popup1" class="overlay">
    <div class="popup">
      <h2>{{ user.name }} Correctly added! :) </h2>
      <a class="close" href="#">&times;</a>
      <div class="content">
        ...
      </div>
    </div>
  </div>

  <div id="popup1bis" class="overlay">
    <div class="popup">
      <h2>{{ user.name }} Correctly removed! :) </h2>
      <a class="close" href="#">&times;</a>
      <div class="content">
        ...
      </div>
    </div>
  </div>

  <div id="popup2" class="overlay">
    <div class="popup">
      <h2>Send private messge to {{ user.name }}</h2>
      <a class="close" href="#">&times;</a>
      <div class="content">
        <div class="chat-input-container">
          <input type="text" placeholder="Type a message...">
          <Button>Send</Button>
        </div>
      </div>
    </div>
  </div>

  <div id="popup3" class="overlay">
    <div class="popup">
      <Button>Report user</Button>
      <Button>Block user</Button>
      <Button>Autre?</Button>
      <a class="close" href="#">&times;</a>
    </div>
  </div>

</template>

<script setup lang="ts">

  
  // var buttonName = "Add friend"

  import {defineProps} from 'vue';
  import UserAvatar from "@/components/UserAvatar.vue";
  import {ref} from 'vue';

  var buttonName = ref('add friend');
  var addRemove = ref(buttonName == 'add friend' ? '#popup1' : '#popup1bis');

  defineEmits(['setActive', 'setInactive'])

  const props = defineProps<{
    user: object,
    isActive: boolean,
  }>()

</script>

<style scoped lang="scss">
p {
  cursor: pointer;
  text-align: left;

  .user-details-panel {
    width: 400px;
    padding: 30px;
    border-radius: 10px;
    border: 5px solid yellow;
    background: white;
    color: black;
    position: absolute;
    z-index: 10;
  }
}


.button {
  font-size: 1em;
  background: #e2e2e2;
  color: rgb(41, 39, 39);
  border: 2px solid #2b2b2b;
  border-radius: 20px/50px;
  text-decoration: none;
  cursor: pointer;
}
.button:hover {
  background: #d8b806;
}

.overlay {
  position: fixed;
  width: 1000px;
  opacity: 0;
}
.overlay:target {
  opacity: 1;
}

.popup {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
}

.popup h2 {
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}
.popup .close {
  position: absolute;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

</style>
