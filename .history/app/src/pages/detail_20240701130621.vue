<script setup>
import NavBar from "../components/NavBar";
import MovieDetail from "../components/MovieDetail";
import FooterBar from "../components/FooterBar";
import Breadcrumb from "@/components/Breadcrumb.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container>
        <!-- <breadcrumb /> -->
        <movie-detail />
      </v-container>
      
    </v-main>
    <footer-bar />
  </v-app>
</template>
