<template>
  <HeaderPack></HeaderPack>
  <section class="credit-wrapper">
  <GitHubCard :link="creator.githubLink" v-for="creator in creators">
    <h2>{{ creator.name }}</h2>
    <p class="quote">{{ "~ " + creator.title }}</p>
  </GitHubCard>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GitHubCard from "@/components/GitHubCard.vue";
import HeaderPack from "@/components/headers/HeaderPack.vue";

const creators = ref(
    [
      {
        name: 'Bima42',
        title: 'The Documenter',
        githubLink: 'https://github.com/Bima42',
        website: ''
      },
      {
        name: 'YvanoffP',
        title: 'The Marketer',
        githubLink: 'https://github.com/YvanoffP',
        website: ''
      },
      {
        name: 'Santonie',
        title: 'The Designer',
        githubLink: '',
        website: ''
      },
      {
        name: 'Tyrossel',
        title: 'The Superviser',
        githubLink: 'https://github.com/Tyrossel',
        website: ''
      },
      {
        name: 'Lbelet',
        title: 'Official Alain Chabat doppleganger',
        githubLink: '',
        website: ''
      },
    ]
)
const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.credit-wrapper {
  grid-area: $main;
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