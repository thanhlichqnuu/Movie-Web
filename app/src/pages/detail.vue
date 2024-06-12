<script setup>
import NavBar from "../components/NavBar";
import MovieDetail from "../components/MovieDetail";
import FooterBar from "../components/FooterBar";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <movie-detail />
    </v-main>
    <footer-bar />
  </v-app>
</template>
