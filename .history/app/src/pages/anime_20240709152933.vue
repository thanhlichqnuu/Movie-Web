<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide.vue";
import SectionAnimes from "@/components/SectionAnimes.vue";
import FooterBar from "@/components/FooterBar.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="animes"/>
      <keep-alive>
      
      </keep-alive>
      <section-animes />
    </v-main>
    <footer-bar />
  </v-app>
</template>
