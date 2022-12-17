<template>
	<table>
		<tr>
			<th>Title 1</th>
			<th>Title 2</th>
			<th>Title 3</th>
		</tr>
		<tr>
			<td>Subtitle 1</td>
			<td>Subtitle 2</td>
			<td>Subtitle 3</td>
		</tr>
		<tr>
			<td>aaa</td>
			<td>bbb</td>
			<td><button>Button</button></td>
		</tr>
	</table>
</template>

<script lang="ts">
  import CustomButton from '@/components/CustomButton.vue';
</script>

<style scoped lang="scss">
table
{
	border-collapse: collapse;
	width: 100%;

	th, td {
		border: 1px solid rgb(255, 187, 0);
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: #6e6b65;
	}

	th {
		background-color: #f0c400;
		color: white;
	}
}
</style>
