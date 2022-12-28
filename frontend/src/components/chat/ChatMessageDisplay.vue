<template>
	<div>
		<ButtonDisplay></ButtonDisplay>
	</div>

	<div class="chat-messages">
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>testeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<h5>user : message</h5>
		<!--Chat messages will be added here dynamically using JavaScript; example-->
	</div>
</template>

<script setup lang="ts">
	import ButtonDisplay from '@/components/chat/ButtonDisplay.vue';
</script>

<style scoped lang="scss">
	#chat .chat-messages {
		overflow-y: auto;
		overflow-x: auto;
		height: 407px;
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
	}
	#chat .chat-message .chat-message-text {
		margin-left: 10px;
	}
	#chat .chat-message .chat-message-sender {
		font-weight: bold;
	}
</style>
