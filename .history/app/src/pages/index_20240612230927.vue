<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide.vue";
import SectionMovies from "@/components/SectionMovies.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useWindowSize } from '@vueuse/core';
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="movies"/>
      <section-movies />
    </v-main>
    <footer-bar />
  </v-app>
</template>


