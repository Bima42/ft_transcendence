<template>
	<section class="chat-wrapper">
	<div id="chat">
		<div>
			<ChatHeader></ChatHeader>
		</div>
		<div class="chat-container">
			<ChatUserList></ChatUserList>
			<ChatMessageDisplay></ChatMessageDisplay>
		</div>
			<ChatTypeBox></ChatTypeBox>
	</div>
	</section>
  </template>

  <script setup lang="ts">
	import ChatTypeBox from './ChatTypeBox.vue';
	import ChatMessageDisplay from './ChatMessageDisplay.vue';
	import ChatUserList from './ChatUserList.vue';
	import ChatHeader from './ChatHeader.vue';
  </script>

  <style scoped lang="scss">
  .chat-wrapper {
	grid-area: $main;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
  }

  #chat {
	background-color: rgb(22, 20, 20);
	border: 1px solid rgb(255, 225, 0);
	border-radius: 5px;
	box-shadow: 5px 5px 30px rgba(255, 0, 128, 0.5); /* Pink shadow */
	// overflow-y: scroll;
  }
  #chat .chat-container {
	display: flex;
	height: 407px;
	}
  </style>
