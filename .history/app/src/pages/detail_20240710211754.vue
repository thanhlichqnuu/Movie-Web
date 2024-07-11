<script setup>
import NavBar from "../components/NavBar";
import MovieDetail from "../components/MovieDetail";
import FooterBar from "../components/FooterBar";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FacebookComments from "@/components/FacebookComments.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container>
        <breadcrumb />
        <movie-detail />
        
            <template v-slot:fb-div>
              <facebook-comments :href="`https://motphimmoi.com/${route.params.slugMovie}`" />
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>
