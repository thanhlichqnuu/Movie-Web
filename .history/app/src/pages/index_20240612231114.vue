<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide.vue";
import SectionMovies from "@/components/SectionMovies.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useWindowSize } from '@vueuse/core';
const { width: windowWidth } = useWindowSize();
const isTablet = computed(() => windowWidth.value < 1024);
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <template v-if="!isTablet">
        <movies-slide apiKey="movies"/>
      </template>
      
      <section-movies />
    </v-main>
    <footer-bar />
  </v-app>
</template>


