<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const movieName = ref(null);
const loading = ref(true);

const isCurrentRoute = (item, index) => {
  return index === breadcrumbs.value.length - 1;
};

const getMovieName = async (slug) => {
  loading.value = true;
  const { data } = await axios.get(`https://ophim1.com/phim/${slug}`);
  movieName.value = data.movie.name;
  loading.value = false;
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


</script>

<template>
  <v-breadcrumbs v-if="!loading" :items="breadcrumbs" divider="/">
    <template v-slot:item="{ item, index }">
      <v-breadcrumbs-item :to="item.to" :disabled="isCurrentRoute(item, index)">
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>
