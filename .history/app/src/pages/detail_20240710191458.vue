<script setup>
import NavBar from "../components/NavBar";
import MovieDetail from "../components/MovieDetail";
import FooterBar from "../components/FooterBar";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { onMounted } from "vue";
import { useFacebookStore } from "@/stores/useFacebookStore";
import { useRoute } from "vue-router";


</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container>
        <breadcrumb />
        <movie-detail />
        <v-row class="mt-5">
      <v-col cols="12">
        <div
          class="fb-comments"
          :data-href="`https://motphimmoi.com/${route.params.slugMovie}`"
          data-width="100%"
          data-numposts="5"
        ></div>
      </v-col>
    </v-row>
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>
