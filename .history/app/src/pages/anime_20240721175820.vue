<script setup>
import NavBar from "@/components/NavBar.vue";
import MoviesSlide from "@/components/MoviesSlide.vue";
import SectionAnimes from "@/components/SectionAnimes.vue";
import FooterBar from "@/components/FooterBar.vue";
import NewlyMovies from "@/components/NewlyMovies.vue";
import FacebookComments from "@/components/FacebookComments.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movies-slide apiKey="animes" />
      <section-animes>
        <template v-slot:sidebar>
          <newly-movies />
          <facebook-comments class="mt-4" href="https://movie-web-two-jade.vercel.app" />
        </template>
      </section-animes>
    </v-main>
    <footer-bar />
  </v-app>
</template>
