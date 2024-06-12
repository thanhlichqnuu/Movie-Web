<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide";
import SeriesMovies from "@/components/SectionSeriesMovies.vue";
import FooterBar from "@/components/FooterBar.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="seriesMovies"/>
      <series-movies />
    </v-main>
    <footer-bar />
  </v-app>
</template>


