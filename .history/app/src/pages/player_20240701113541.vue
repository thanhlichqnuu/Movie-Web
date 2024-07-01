<script setup>
import NavBar from "@/components/NavBar.vue";
import PlayerModal from "@/components/PlayerModal.vue";
import FooterBar from "@/components/FooterBar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container class="pt-0">
        <breadcrumb />
        <player-modal/>
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>


