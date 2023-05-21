<template>
	<section class="view_wrapper">
		<section class="view_header">
			<h2
				v-for="source in friendListsSources"
				:key="source.id"
				@click="selectList(source.name)"
				:class="[selectedList === source.name ? '' : 'not_selected']"
			>
				{{ source.name }}
			</h2>
		</section>
		<div class="friends_content">
			<FriendList v-if="route.name === 'friends'"/>
			<RequestList v-else/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FriendList from '@/components/user/FriendList.vue'
import RequestList from '@/components/user/RequestList.vue'
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const selectedList = ref(route.name === 'friends' ? 'Friends' : 'Requests')
watch(() => route.name, (newVal) => {
	selectedList.value = newVal === 'friends' ? 'Friends' : 'Requests'
})

const friendListsSources = ref({
	friendList: {
		name: 'Friends',
		id: 'public',
	},
	requestList: {
		name: 'Requests',
		id: 'public',
	},
})

const selectList = (listName: string) => {
	listName === 'Friends'
		? router.push('/main/friends')
		: router.push('/main/friends/requests')
	selectedList.value = listName
}
</script>

<style scoped lang="scss">
.view_wrapper {

	h2:hover {
		cursor: pointer;
	}

	.not_selected {
		transition: color 0.2s ease-in-out;
		color: $secondary;
	}

	svg {
		height: 50%;
		position: absolute;
		left: 10px;
		top: calc(50% - 10px);
		cursor: pointer;
	}
}

.friends_content {
	height: 100%;
	width: 100%;
	overflow: auto;
}
</style>