<template>
    <section class="credit-wrapper">
        <GitHubCard :link="creator.githubLink" v-for="creator in creators">
            <h2>{{ creator.name }}</h2>
            <p class="quote">{{ "~ " + creator.title }}</p>
        </GitHubCard>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GitHubCard from '@/components/footers/GitHubCard.vue'

const creators = ref(
    [
        {
            name: 'Bima42',
            title: 'BackMan',
            githubLink: 'https://github.com/Bima42',
            website: ''
        },
        {
            name: 'YvanoffP',
            title: 'FrontMan',
            githubLink: 'https://github.com/YvanoffP',
            website: ''
        },
        {
            name: 'Tyrossel',
            title: 'GeniusMan',
            githubLink: 'https://github.com/Tyrossel',
            website: ''
        },
    ]
)
</script>

<style scoped lang="scss">
.credit-wrapper {
    grid-area: $gigamain;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 50px;
}
</style>