<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide";
import SingleMovies from "@/components/SectionSingleMovies.vue";
import FooterBar from "@/components/FooterBar.vue";
import NewlyMovies from "@/components/NewlyMovies.vue";
import FacebookComments from "@/components/FacebookComments.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="singleMovies"/>
      <single-movies>
        <template v-slot:sidebar>
          <newly-movies />
          <facebook-comments class="mt-4" href="https://ghienphim.fun" />
        </template>
      </single-movies>
    </v-main>
    <footer-bar />
  </v-app>
</template>


