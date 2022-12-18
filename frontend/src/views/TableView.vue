<template>
	<div class="tableDiv">

		<CustomTable></CustomTable>

	</div>
</template>

<script setup lang="ts">
	import CustomTable from '@/components/CustomTable.vue'

	import { ref } from 'vue'
	import { useRouter } from 'vue-router'

	const router = useRouter()

	function loginClick(e: Event) {
	  router.push('/table')
	}
</script>

<style scoped lang="scss">
.tableDiv {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
