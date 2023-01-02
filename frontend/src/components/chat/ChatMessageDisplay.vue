<template>
	<div class="chat-messages">
		<div>
			<ButtonDisplay></ButtonDisplay>
		</div>
		<!--Chat messages will be added here dynamically using JavaScript; example-->
	</div>
</template>

<script setup lang="ts">
	import ButtonDisplay from '@/components/chat/ButtonDisplay.vue';
	import ChatTypeBox from '@/components/chat/TypeBox.vue';

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
