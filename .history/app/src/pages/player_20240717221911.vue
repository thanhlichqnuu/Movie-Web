<script setup>
import NavBar from "@/components/NavBar.vue";
import PlayerModal from "@/components/PlayerModal.vue";
import FooterBar from "@/components/FooterBar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FacebookComments from "@/components/FacebookComments.vue";
import NewlyMovies from "@/components/NewlyMovies.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container class="pt-0">
        <breadcrumb class="mb-n10"/>
        <player-modal>
          <template v-slot:newlymovies>
           <newly-movies /> 
          </template>
          <template v-slot:fbdiv>
            <facebook-comments
              :href="`https://motphimmoi.com/${route.params.slugMovie}`"
            />
          </template>
        </player-modal>
        
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>


