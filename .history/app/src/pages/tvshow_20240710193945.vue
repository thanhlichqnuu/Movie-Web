<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide";
import SectionTVShows from "@/components/SectionTVShows.vue";
import FooterBar from "@/components/FooterBar.vue";
import NewlyMovies from "@/components/NewlyMovies.vue";
import FacebookComments from "@/components/FacebookComments.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="tvShows" />
      <SectionTVShows
        <template v-slot:sidebar>
          <newly-movies />
          <facebook-comments class="mt-4" href="https://motphimmoi.com" />
        </template>
        <SectionTVShows />
    </v-main>
    <footer-bar />
  </v-app>
</template>
