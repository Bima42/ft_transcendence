<template>

<div class="chat-sidebar">
  <div>
    <button @click="isShow = !isShow">Online Friens</button>
    <div v-if="isShow">
      <p v-on:click="showContent = !showContent" class="text">Bima</p>
      <p v-if="showContent" class="content">User info/ +block contact / +send privmsg</p>
	  <p v-on:click="showContent = !showContent" class="text">lbelet</p>
      <p v-if="showContent" class="content">User info/ +block contact / +send privmsg</p>
    </div>
  </div>
  <div>
    <button @click="isShow2 = !isShow2">Online Users</button>
    <div v-show="isShow2">
      <p v-on:click="showContent2 = !showContent2" class="text">Raymond R.</p>
      <p v-show="showContent2" class="content">User info/ +block contact / +send privmsg</p>

    </div>
  </div>
	<!-- <h2>Connected Users</h2> -->
	<!-- <ul class="chat-users"> -->
	  <!-- Connected users will be added here dynamically using JavaScript -->
	  <!-- user1...
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5> -->

	<!-- </ul>
	<h2>Connected Friends</h2>
	<ul class="chat-users"> -->
	  <!-- Connected users will be added here dynamically using JavaScript -->
	  <!-- <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	  <h5>test</h5>
	</ul> -->
  </div>
</template>

<script  lang="ts">
import Modal from '@/components/modal/Modal.vue';

export default {
	name: "Display",
	data: function () {
	return {
		isShow: false,
		isShow2: false,
		showContent: false,
		showContent2: false,
	};
},

  props: {
    msg: String,
  },
};
</script>

<style scoped lang="scss">
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
	#chat .chat-sidebar {
		width: 300px;
		height: 407px;
		border-right: 1px solid rgb(255, 204, 0);
		padding: 10px;
		overflow-y: auto;
	}
	#chat .chat-sidebar h2 {
		margin: 0;
		font-size: 1.1em;
		color: rgb(255, 217, 0);
		font-weight: normal;
	}

</style>
