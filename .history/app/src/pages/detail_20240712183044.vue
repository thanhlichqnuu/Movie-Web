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
        <v-row class="pl-1">
          <v-col cols="12">
            <facebook-like
          :href="`https://motphimmoi.com/${route.params.slugMovie}`"
        />
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
