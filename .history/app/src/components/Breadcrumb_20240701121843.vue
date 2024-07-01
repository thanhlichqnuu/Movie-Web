<template>
  <v-breadcrumbs :items="breadcrumbs" divider="/">
    <template v-slot:item="{ item, index }">
      <v-breadcrumbs-item :to="item.to" :disabled="isCurrentRoute(item, index)">
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isCurrentRoute = (item, index) => {
  return index === breadcrumbs.value.length - 1;
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
        text = route.params.slugMovie;
      } else if (matchedRoute.name === "Player") {
        if (route.params.slugEpisode) {
          return [
            {
              text: route.params.slugMovie,
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
