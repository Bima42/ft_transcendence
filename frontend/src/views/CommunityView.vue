<template>
	<div id="chat">

		<div class="chat-header">
			<h1>Chat</h1>
			<div class="chat-tabs">
				<button class="chat-tab" id="tab1">General Chat Room</button>
				<button class="chat-tab" id="tab2">Private Chat Room</button>
			</div>
		</div>

		<div class="chat-container">
			<div class="chat-sidebar">
				<h2>Connected Users</h2>
				<ul class="chat-users">
				<!-- Connected users will be added here dynamically using JavaScript -->
				user1...
				</ul>
				<h2>Connected Friends</h2>
				<ul class="chat-users">
				<!-- Connected users will be added here dynamically using JavaScript -->
				Toto
				</ul>
			</div>

			<div class="chat-messages">
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
				<h5>test</h5>
				<h5>test</h5>
				<!--Chat messages will be added here dynamically using JavaScript; example-->
			</div>
		</div>

		<div class="chat-input-container">
			<input type="text" placeholder="Type a message..." class="chat-input">
			<button class="chat-send-button">Send</button>
		</div>
	</div>
</template>

<script setup lang="ts">
// Chat message example
// function addMessage(sender, message) {
// // Create the chat message element
// var chatMessage = document.createElement("div");
// chatMessage.classList.add("chat-message");

// // Create the sender element
// var senderElement = document.createElement("div");
// senderElement.classList
</script>

<style scoped lang="scss">

#chat {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 900px;
	height: 550px;
	background-color: rgb(22, 20, 20);
	border: 1px solid rgb(255, 225, 0);
	border-radius: 5px;
	box-shadow: 5px 5px 30px rgba(255, 0, 128, 0.5); /* Pink shadow */
	// overflow-y: scroll;
}

#chat .chat-header {
	background-color: #403c3e5d;
	border-bottom: 1px solid rgb(255, 200, 0);
	padding: 10px;
	text-align: center;
}
#chat .chat-header h1 {
	margin: 0;
	color: rgb(255, 208, 0);
	font-size: 1.2em;
	font-weight: bolder;
	padding-bottom: 20px;
}
#chat .chat-tabs {
	display: flex;
	justify-content: flex-end; /* Align to the right */
}

#chat .chat-tab {
	width: 300px;
	background-color: #413d3d;
	border: none;
	border-radius: 5px;
	color: rgb(255, 196, 0);
	cursor: pointer;
	font-size: 1em;
	padding: 5px 10px;
	margin-left: 10px;
	box-shadow: 3px 3px 5px rgba(255, 0, 128, 0.5); /* Pink shadow */
}

#chat .chat-tab:hover {
	background-color: rgb(255, 193, 7);
	color: grey;
}

#chat .chat-tab.active {
	background-color: #ea00ffc9;
	color: rgb(252, 215, 5);
}

#chat .chat-container{
	display: flex;
	height: 407px;
}

#chat .chat-messages{
	overflow-y: auto;
	height: 407px;
	width: 100%;
}
#chat .chat-sidebar {
	width: 200px;
	height: 407px;
	border-right: 1px solid rgb(255, 204, 0);
	padding: 10px;
}

#chat .chat-sidebar h2 {
	margin: 0;
	font-size: 1.1em;
	color: rgb(255, 217, 0);
	font-weight: normal;
}

#chat .chat-sidebar .chat-users {
	list-style: none;
	margin: 0;
	padding: 0;
}
#chat .chat-sidebar .chat-user {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

#chat .chat-sidebar .chat-user .chat-user-avatar {
	border-radius: 50%;
	width: 50px;
	height: 50px;
	margin-right: 10px;
}
#chat .chat-sidebar .chat-user .chat-user-username {
	font-weight: bold;
}

#chat .chat-messages {
	padding: 10px;
	margin-bottom: 10px;
}

#chat .chat-message .chat-message-sender {
	font-weight: bold;
}

#chat .chat-message .chat-message-text {
  margin-left: 10px;
}

#chat .chat-input-container {
	position: relative;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	border-top: 1px solid rgb(255, 221, 1);
	padding: 10px;
}

#chat .chat-input {
	flex: 1;
	height: 30px;
	border: 1px solid yellow;
	background-color: rgb(49, 49, 47);
	border-radius: 5px;
	padding: 0 10px;
}

#chat .chat-send-button {
	color: rgb(255, 193, 7);
	background-color: rgb(83, 83, 83);
	border: none;
	border-radius: 5px;
	height: 30px;
	width: 80px;
	cursor: pointer;
}
#chat .chat-send-button:hover {
	background-color: rgb(255, 193, 7);
	color: rgb(91, 90, 90);
}

</style>
