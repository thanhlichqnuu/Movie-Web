<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide";
import SingleMovies from "@/components/SectionSingleMovies.vue";
import FooterBar from "@/components/FooterBar.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey=""/>
      <single-movies />
    </v-main>
    <footer-bar />
  </v-app>
</template>


