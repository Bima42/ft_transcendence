<template>
  <div id="leftColumn">
  <h1>Create a new channel</h1>
  <p>Here you can create a new channel, please fill the following info :</p>
  <div class="chat-input-container">
    <input v-model="chatName" type="text" placeholder="Chose the name of the channel" class="chat-input">
    <input v-model="chatPassword" type="password" placeholder="Set Password" class="chat-input">
    <input v-model="chatPassword2" type="password" placeholder="Confirm Password" class="chat-input">
    <input type="text" placeholder="Invite users to the channel" class="chat-input">
    <div class="radio-buttons">
      <label><input v-model="chatType" type="radio" name="type" value="PRIVATE">Private</label>
      <label><input v-model="chatType" type="radio" name="type" value="PUBLIC">Public</label>
    </div>
    <div class="button-container">
      <CustomButton @click="onCreateNewChannel">Create</CustomButton>
      <CustomButton @click="quitButton">Quit</CustomButton>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useModalStore} from "@/stores/modal";
import {useChatStore} from "@/stores/chat";
import CustomButton from '@/components/CustomButton.vue'
import {post} from '../../../utils'
import type IChat from '@/interfaces/chat/IChat'

const modalStore = useModalStore()
const chatStore = useChatStore();

const chatName = ref('');
const chatPassword = ref('');
const chatPassword2 = ref('');
const chatType = ref('');

async function onCreateNewChannel(e: Event) {

	const newChat : IChat = {
		id: undefined,
		type: (chatType.value == 'PRIVATE' ? 'PRIVATE' : 'PUBLIC'),
		name: chatName.value,
		createdAt: undefined,
		updatedAt: undefined,
		messages: undefined,
		users: undefined
	};

	// TODO: catch error ?
	await post('chat/rooms', "Cannot create channel", newChat)
        .then((response) => response.json())
        .then(json => {
            modalStore.resetState();
            chatStore.currentChat = json;
        })
        .catch(err => {
            console.log(err);
        });
}

function quitButton(e: Event) {
  modalStore.resetState();
}
</script>

<style lang="scss" scoped>

#leftColumn {
  display: flex;
  flex-direction: column; /*aligns items vertically*/
  align-items: left;
  justify-items: left;
}

.radio-buttons {
  color: rgb(255, 179, 0);
  margin: 10px;
  padding: 10px;
}

h1 {
  margin-bottom: 20px;
  font-size: 2em;
  font-weight: bold;
  color: rgb(255, 179, 0);
  text-align: center;
}

p {
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
</style>
