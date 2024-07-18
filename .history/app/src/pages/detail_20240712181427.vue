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
        <facebook-like
          :href="`https://motphimmoi.com/${route.params.slugMovie}`"
        />
        <iframe
          src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fmotphimmoi.com&width=450&layout&action&size&share=true&height=35&appId=973607627550804"
          width="450"
          height="35"
          style="border: none; overflow: hidden"
          scrolling="no"
          frameborder="0"
          allowfullscreen="true"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
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
