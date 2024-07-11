<script setup>
import NavBar from "@/components/NavBar.vue";
import PlayerModal from "@/components/PlayerModal.vue";
import FooterBar from "@/components/FooterBar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FacebookComments from "@/components/FacebookComments.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container class="pt-0">
        <breadcrumb />
        <player-modal/>
        <v-row class="mt-5">
          
        </v-row>
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>


