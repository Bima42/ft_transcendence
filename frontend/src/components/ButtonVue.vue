<template>
	<button class="MyCustomButton">{{ label }}</button>
</template>

<script>
export default {
	props: ['label']
}
</script>

<style>

.MyCustomButton {
	background: #ffdd42;
	font-size: 16px;
	color: #121212;
	border-radius: 16px;
	border-width: 3px;
	box-shadow: 0;
	border-color: #ffdd42;
	padding-left: 20px;
	padding-right: 20px;
	padding-top: 5px;
	padding-bottom: 5px;
	margin: 5px;

}

.MyCustomButton:hover {
		background: #ffff00;
		border-width: 3px;
		border-color: #eeee42;
}


</style>
