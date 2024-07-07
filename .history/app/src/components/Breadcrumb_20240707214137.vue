<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";

const route = useRoute();
const movieName = ref(null);
const isLoading = ref(true);
const { t } = useI18n();

const homeLabel = computed(() => t('seriesMovie'));

const isCurrentRoute = (item, index) => {
  return index === breadcrumbs.value.length - 1;
};

const getMovieName = async (slug) => {
  try {
    isLoading.value = true;
    const { data } = await axios.get(`https://ophim1.com/phim/${slug}`);
    movieName.value = data.movie.name;
    isLoading.value = false;
  } catch {
    return;
  }
};

const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched;
  const homeBreadcrumb = {
    text: "Home",
    to: "/",
  };

  const routeBreadcrumbs = matchedRoutes
    .map((matchedRoute) => {
      let text = matchedRoute.name;
      let to = matchedRoute.path;

      if (matchedRoute.name === "Detail" && route.params.slugMovie) {
        text = movieName.value;
      } else if (matchedRoute.name === "Player") {
        if (route.params.slugEpisode) {
          return [
            {
              text: movieName.value,
              to: `/${route.params.slugMovie}`,
            },
            {
              text: route.params.slugEpisode,
            },
          ];
        }
      }

      return {
        text,
        to,
      };
    })
    .flat();

  return [homeBreadcrumb, ...routeBreadcrumbs];
});

watch(
  () => route.params.slugMovie,
  (newSlug) => {
    if (newSlug) {
      getMovieName(newSlug);
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-breadcrumbs v-if="!isLoading" :items="breadcrumbs" divider="/">
    <template v-slot:item="{ item, index }">
      <v-breadcrumbs-item :to="item.to" :disabled="isCurrentRoute(item, index)">
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>
