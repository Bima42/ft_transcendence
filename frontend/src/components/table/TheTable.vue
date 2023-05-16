<template>
	<section class="table_wrapper">
		<table>
			<thead>
			<tr>
				<th v-for="(header, index) in props.headers" :key="index" @click="sortDatas(header.name)">
					{{ header.name }}
				</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(row, index) in tableDataPaginated" :key="index">
				<td v-for="(data, index) in row" :key="index">{{ data }}</td>
			</tr>
			</tbody>
		</table>
		<div class="table_buttons" v-if="totalPages > 0">
			<ButtonCustom @click="prevPage" :disabled="currentPage === 1">Prev</ButtonCustom>
			<span>Page {{ currentPage }} of {{ totalPages }}</span>
			<ButtonCustom @click="nextPage" :disabled="currentPage === totalPages">Next</ButtonCustom>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const props = defineProps<{
	data: object[],
	headers: any,
	rowsPerPage?: number,
	sortDatas?: (header: string) => void
}>()

const sortDatas = props.sortDatas ? props.sortDatas : function () {
}
const currentPage = ref(1);
const rowsPerPage = props.rowsPerPage ?? 5;

const totalPages = computed(() => {
	return Math.ceil(props.data.length / rowsPerPage)
});
const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};
const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};
const tableDataPaginated = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	return props.data.slice(start, end);
});

</script>

<style scoped lang="scss">
.table_wrapper {
	grid-area: $main;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	font-family: 'Karla', sans-serif;
	font-weight: 400;

	.table_buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: $medium_gap;
	}

	table {
		width: 100%;
		border-radius: 5px;
		border-collapse: collapse;
		overflow: hidden;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
		margin: 20px auto;

		line-height: 1.5;
		text-align: center;

		thead tr th {
			background-color: $secondary;
			font-weight: 700;
			border-bottom: 1px solid $tertiary;
			border-top: 1px solid $tertiary;
			color: white;
		}

		th,
		td {
			padding: 12px 0 12px 0;
		}

		tbody tr {
			border-bottom: 1px solid #dddddd;
		}

		tbody tr:nth-of-type(even) {
			background-color: $lighter-gray;
		}

		tbody tr:last-of-type {
			border-bottom: 1px solid $tertiary;
		}
	}
}
</style>
