<template>
    <h1> Please select a version of the game :</h1>

    <div id="wrapper">
        <CustomButton id="classic_btn" class="enabled_button" @click="classic_click">Classic 1972 Pong</CustomButton>
        <CustomButton id="custom_btn" class="disabled_button" @click="custom_click">Hardcore Pong</CustomButton>
    </div>

    <h2> When you're ready to start playing, simply join the queue and wait for an opponent to be matched with. </h2>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import CustomButton from '@/components/multiusage/CustomButton.vue';


const emit = defineEmits(['JoinClassic', 'JoinCustom'])

const classic_click = () => {
    document.querySelector('#custom_btn').className = 'disabled_button';
    document.querySelector('#classic_btn').className = 'enabled_button';
    emit('JoinClassic')
}

const custom_click = () => {
    document.querySelector('#custom_btn').className = 'enabled_button';
    document.querySelector('#classic_btn').className = 'disabled_button';
    emit('JoinCustom')
}
</script>


<style scoped lang="scss">

#wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    grid-area: $main;
}

h1 {
    text-align: center;
    margin: 10px;
    color: $yellow;
}

h2 {
    text-align: center;
    margin: 10px 0 30px;
    color: $yellow;
}

button {
    border-radius: 16px;
    background: $yellow;
    padding: 5px 12px;
    border: none;
    margin: 10px;

    &:hover {
        cursor: pointer;
        filter: hue-rotate(180deg);
    }

    &.fat {
        font-weight: 900;
    }

}

.enabled_button {
    background-color: $yellow;

}

.disabled_button {
    background-color: $lighter-gray;
    color: white;

}
</style>
