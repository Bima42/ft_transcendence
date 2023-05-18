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
		<div class="table_buttons" v-if="totalPages > 1">
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
    gap: 20px;
	font-family: 'Martian Mono', sans-serif;
    font-size: 12px;

    @media (max-width: 980px) {
        font-size: 12px;
    }
	.table_buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: $medium_gap;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		overflow: hidden;
		margin: 0 auto;
		font-family: 'Martian Mono', sans-serif;
		font-weight: 400;
		letter-spacing: -0.15em;
		text-align: center;

		@media (orientation: landscape) {
			font-weight: 700;
			letter-spacing: unset;
			font-size: large;
		}

		thead tr {
			height: 5em;
		}

		thead tr th {
			background-color: $secondary;
			font-weight: 700;
			border-bottom: 1px solid $tertiary;
			border-top: 1px solid $tertiary;
			color: white;
			vertical-align: middle;
		}

		th,
		td {
			padding: 12px 5px 12px 5px;
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
