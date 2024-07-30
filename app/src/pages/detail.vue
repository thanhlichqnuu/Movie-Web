<script setup>
import NavBar from "../components/NavBar";
import MovieDetail from "../components/MovieDetail";
import FooterBar from "../components/FooterBar";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FacebookComments from "@/components/FacebookComments.vue";
import FacebookLike from "@/components/FacebookLike.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container>
        <breadcrumb />
        <v-row>
          <v-col cols="12" class="mt-n3 mb-n2">
            <facebook-like />
          </v-col>
        </v-row>
       
        <movie-detail>
          <template v-slot:fbdiv>
            <facebook-comments
              :href="`https://motphimmoi.com/${route.params.slugMovie}`"
            />
          </template>
        </movie-detail>
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>
