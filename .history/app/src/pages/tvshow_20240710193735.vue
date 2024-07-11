<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide";
import SectionTVShows from "@/components/SectionTVShows.vue";
import FooterBar from "@/components/FooterBar.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="tvShows" />
      <sec
    </v-main>
    <footer-bar />
  </v-app>
</template>
