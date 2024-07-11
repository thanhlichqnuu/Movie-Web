<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { useMovieStore } from "@/stores/useMovieStore";

const { t } = useI18n();
const movieLabel = computed(() => t("singleMovie"));
const seriesLabel = computed(() => t("seriesMovie"));
const themeStore = useStateThemeStore();
const movieStore = useMovieStore();
const isLoading = ref(false);

const tabs = ref([
  {
    name: "Anime",
    key: "animes",
  },
  {
    name: movieLabel,
    key: "singleMovies",
  },
  {
    name: seriesLabel,
    key: "seriesMovies",
  },
  {
    name: "TV Show",
    key: "tvShows",
  },
]);

const router = useRouter();
const currentTab = ref(tabs.value[0].name);
const movies = ref([]);

const getMovies = async (key) => {
  isLoading.value = true;
  await movieStore.fetchMoviesIfNotExist(key);
  movies.value = movieStore.movies[key];
  isLoading.value = false;
};

getMovies(tabs.value[0].key);

const changeTab = (tab) => {
  currentTab.value = tab.name;
  tabs.value.forEach((t) => (t.isActive = t.name === tab.name));
  getMovies(tab.key);
};

const navigateToDetail = (slug) => {
  router.push({ name: "Detail", params: { slugMovie: slug } });
};
</script>
<template>
  <v-main style="margin-top: -6px">
    <div>
      <h3 class="d-flex justify-start animate-charcter">
        {{ $t("lastUpdateLabel") }}
      </h3>
      <div class="line" />
    </div>

    <v-tabs v-model="currentTab">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        @click="changeTab(tab)"
        class="tab-active"
      >
        {{ tab.name }}
        <div
          v-show="tab.isActive"
          :class="
            themeStore.isDark ? 'tab-indicator-white' : 'tab-indicator-black'
          "
        />
      </v-tab>
    </v-tabs>

    <div v-show="!isLoading">
      <v-card
        v-for="movie in movies"
        :key="movie._id"
        @click="navigateToDetail(movie.slug)"
        class="mb-3"
      >
        <div class="d-flex">
          <v-img
            :src="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
            loading="lazy"
            style="width: 65px; height: auto"
          ></v-img>
          <v-list-item class="mt-n5 w-100">
            <div class="d-flex">
              <v-card-title class="text-subtitle-2">{{
                movie.name
              }}</v-card-title>
            </div>
            <v-badge color="red" class="ml-7 mb-2">
              <template v-slot:badge>
                <span>{{ movie.year }}</span>
              </template>
            </v-badge>
            <v-badge color="blue" class="ml-12 mb-2">
              <template v-slot:badge>
                <span
                  >Season {{ movie.tmdb.season ? movie.tmdb.season : 1 }}</span
                >
              </template>
            </v-badge>
            <v-badge color="green" class="mb-2" style="margin-left: 71px">
              <template v-slot:badge>
                <span>{{ movie.tmdb.type?.toUpperCase() }}</span>
              </template>
            </v-badge>
          </v-list-item>
        </div>
      </v-card>
    </div>
  </v-main>
</template>
