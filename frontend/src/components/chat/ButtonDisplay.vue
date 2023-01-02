<template>
	<!-- <div>
		<button @click="isShow = !isShow">Direct Chats</button>
		<div v-if="isShow">
			<p v-on:click="showContent = !showContent" class="text">Chat 1</p>
			<p v-if="showContent" class="content">This is the discussion that will be displayed when the chat is clicked</p>
		</div>
	</div>
	<div>
		<button @click="isShow2 = !isShow2">Channels</button>
		<div v-if="isShow2">
			<p v-on:click="showContent2 = !showContent2" class="text">Chat 1</p>
			<p v-if="showContent2" class="content">This is the discussion that will be displayed when the chat is clicked</p>
		</div>
	</div>
	<div>
  <button @click="isShow3 = !isShow3">General Channel</button>
  <div v-if="isShow3">
    <p v-on:click="showContent3 = !showContent3" class="text">Chat 1</p>
    <p v-if="showContent3" class="content">This is the discussion that will be displayed when the chat is clicked</p>
  </div>
</div> -->

<div class="container">
  <div>
    <button @click="isShow = !isShow">Direct Chats</button>
    <div v-if="isShow">
      <p v-on:click="showContent = !showContent" class="text">Freddy</p>
      <p v-if="showContent" class="content">HHHEEYYY FREDDY, What's up?</p>
	  <p v-on:click="showContent = !showContent" class="text">Tommy</p>
      <p v-if="showContent" class="content">HHHEEYYY Tommy, Do you like mayo?</p>
    </div>
  </div>
  <div>
    <button @click="isShow2 = !isShow2">Group Channel</button>
    <div v-show="isShow2">
      <p v-on:click="showContent2 = !showContent2" class="text">Team Transcendence</p>
      <p v-show="showContent2" class="content">Bla bla bla</p>
    </div>
  </div>
  <!-- <div>
  <button @click="isShow3 = !isShow3">General Channel</button>
  <div v-show="isShow3">
    <p v-on:click="showContent3 = !showContent3" class="text">Gen Chan</p>
    <div v-show="showContent3" class="content">
      <p>Bla bla bla</p>
      <div class="message-form-container">
        <form @submit.prevent="sendMessage">
          <input type="text" v-model="messageText" placeholder="Type your message here" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</div> -->
<div>
  <button @click="isShow3 = !isShow3">General Channel</button>
  <div v-show="isShow3">
    <p v-on:click="showContent3 = !showContent3" class="text">Gen Chan</p>
    <div v-show="showContent3" class="content">
      <p>Bla bla bla</p>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="messageText" placeholder="Type your message here" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</div>




</div>
</template>

<script lang="ts">
// import Modal from '@/ChatMessageDisplay.vue';
import Modal from '@/components/modal/Modal.vue';

export default {
	name: "Display",
	data: function () {
	return {
		isShow: false,
		isShow2: false,
		isShow3: false,
		showContent: false,
		showContent2: false,
		showContent3: false,
	};
},

  props: {
    msg: String,
  },
};
</script>

<style scoped lang="scss">

.content {
  form {
    display: flex;
    justify-content: flex-end;
  }
}

 .container {
    display: flex;
    flex-direction: column;
    align-items: space-between; /* add space between the buttons */
  }
  .button {
    display: flex;
  }

button {
	width : 150px;
	background: $yellow;
	padding: 5px 12px;
	border: 10px;
	border-color: black;
	margin-bottom: 2px;
	display: flex;

	&:hover {
		cursor: pointer;
		filter: hue-rotate(180deg);
	}

	&.fat {
		font-weight: 900;
	}
}
.text {
  color: yellow;
  cursor: pointer;
  &:hover {
    color: pink;
  }
}

.content {
  color: rgb(255, 191, 0);
  background-color: rgb(36, 34, 34);
  padding: 20px;
  box-shadow: 0 10px 20px rgba(179, 1, 182, 0.19), 0 6px 6px rgba(137, 0, 144, 0.23);
  // display: right;
  display: flex;
  align-items: center;
  justify-content: right;
}
</style>
