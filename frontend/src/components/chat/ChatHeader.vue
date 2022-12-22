<template>
	<div class="chat-header">
				<h1>Chat</h1>
			<div class="chat-tabs">
				<!-- <button class="chat-tab" id="tab1">General Chat Room</button>
				<button class="chat-tab" id="tab2">Private Chat Room</button> -->

				<Tabs>
					<Tab title="Tab 1">Hello From Tab 1</Tab>
					<Tab title="Tab 2">Hello From Tab 2</Tab>
					<Tab title="Tab 3">Hello From Tab 3</Tab>
					<Tab title="Tab 4">Hello From Tab 4</Tab>
				</Tabs>

			</div>
		</div>
</template>

<script setup lang="ts">
	import Tab from '@/components/chat/Tab.vue'
	import Tabs from '@/components/chat/Tabs.vue'
</script>

<script lang="ts">

  export default {
	components: {
		Tab,
		Tabs
	}
  }

</script>

<style scoped lang="scss">
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

</style>
