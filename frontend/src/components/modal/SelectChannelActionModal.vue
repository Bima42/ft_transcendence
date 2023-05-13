<template>
    <section class="channel_action_wrap">
        <section class="modal_header">
            <font-awesome-icon icon="fa-chevron-left" v-if="selectedOption !== 0" @click="selectedOption = 0"/>
        </section>
        <div class="option_wrap" v-if="selectedOption === 0">
            <ButtonCustom :style="'big'" :click="() => handleClick('newChannel')">
                <h1 >Create a channel</h1>
            </ButtonCustom>
            <ButtonCustom :style="'big'" :click="() => handleClick('joinChannel')">
                <h1>Join a channel</h1>
            </ButtonCustom>
            <ButtonCustom :style="'big'" :click="() => handleClick('newWhisper')">
                <h1>Create a Whisper</h1>
            </ButtonCustom>
        </div>
        <NewChannelModal v-if="selectedOption === 1"/>
        <JoinChannelModal v-if="selectedOption === 2"/>
        <NewWhisperModal v-if="selectedOption === 3"/>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NewChannelModal from '@/components/modal/channel/NewChannelModal.vue'
import JoinChannelModal from '@/components/modal/channel/JoinChannelModal.vue'
import NewWhisperModal from '@/components/modal/channel/NewWhisperModal.vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const selectedOption = ref(0)
const handleClick = (option: string) => {
    switch (option) {
        case 'newChannel':
            selectedOption.value = 1;
            break
        case 'joinChannel':
            selectedOption.value = 2;
            break
        case 'newWhisper':
            selectedOption.value = 3;
            break
        default:
            console.log('default')
    }
}
</script>

<style scoped lang="scss">
.channel_action_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    gap: 10px;

    .option_wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-weight: bold;

        &:hover {
            cursor: pointer;
        }
    }
    .modal_header {
        position: absolute;
        left: calc(0% - 14px);
        top: 0;
        display: flex;
        justify-content: flex-start;

        svg {
            font-weight: bold;
            font-size: 30px;
            color: $tertiary;
        }
    }
}
</style>
