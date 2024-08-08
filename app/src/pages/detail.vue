<script setup>
import { ref, watch } from "vue";
import NavBar from "../components/NavBar";
import MovieDetail from "../components/MovieDetail";
import FooterBar from "../components/FooterBar";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FacebookComments from "@/components/FacebookComments.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isMovieLoaded = ref(false);

const handleMovieLoaded = () => {
  isMovieLoaded.value = true;
};

const shareFacebook = async () => {
  const { useShareLink } = await import("vue3-social-sharing");
  const { shareLink } = useShareLink();
  shareLink({
    network: "facebook",
    url: `https://ghienphim.fun/${route.params.slugMovie}`,
  });
};

watch(route, () => {
  isMovieLoaded.value = false;
});
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container>
        <breadcrumb />
        <v-row v-if="isMovieLoaded" class="ml-1">
          <v-col cols="12">
            <v-btn color="#4267B2" size="small" @click="shareFacebook"
              ><div class="ml-n1 mr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-facebook"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
                  />
                </svg>
              </div>
              {{ $t("shareFb") }}
            </v-btn>
          </v-col>
        </v-row>

        <movie-detail @movieLoaded="handleMovieLoaded">
          <template v-slot:fbdiv>
            <facebook-comments
              v-if="isMovieLoaded"
              :href="`https://ghienphim.fun/${route.params.slugMovie}`"
            />
          </template>
        </movie-detail>
      </v-container>
    </v-main>
    <footer-bar />
  </v-app>
</template>
