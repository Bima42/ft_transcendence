<template>
    <section class="UI-grid">
        <template v-if="route.name !== 'landing page'">
            <Sidebar />
            <HeaderLogo />
        </template>
        <TheModal v-if="modalStore.show">
            <Component :is="modalStore.component"/>
        </TheModal>
        <router-view v-slot="{ Component }">
            <Transition>
                <component :is="Component"/>
            </Transition>
        </router-view>
        <CreditLink v-if="route.name !== 'community'"></CreditLink>
    </section>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'

import CreditLink from '@/components/footers/CreditLink.vue'
import Sidebar from '@/components/template/Sidebar.vue'
import TheModal from '@/components/modal/TheModal.vue'
import { useModalStore } from '@/stores/modal'
import HeaderLogo from '@/components/template/HeaderLogo.vue';

const route = useRoute()
const modalStore = useModalStore()
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

#app {
    display: flex;
    width: 100vw;
    height: 100vh;
    font-weight: normal;
    overflow: hidden;

    .UI-grid {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: 20% 30% 30% 20%;
        grid-template-rows: 10% 30% 30% 20% 10%;
        justify-items: center;
        align-items: center;

        grid-template-areas:
            "header1 header1 header2 header3"
            "left1 main1 main1 right1"
            "left1 main2 main2 right1"
            "left1 main3 main3 right1"
            "footer1 footer1 footer1 footer2";
    }
}
</style>
