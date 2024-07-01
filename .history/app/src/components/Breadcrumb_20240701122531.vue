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
  import { computed, ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const movieName = ref('');
  
  const isCurrentRoute = (item, index) => {
    return index === breadcrumbs.value.length - 1;
  };
  
  const getMovieName = async (slug) => {
    try {
      const {data} = await axios.get(`https://ophim1.com/phim/${slug}`);
      movieName.value = response.data.movie.name;
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };
  
  const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched;
    const homeBreadcrumb = {
      text: 'Home',
      to: '/',
    };
  
    const routeBreadcrumbs = matchedRoutes.map((matchedRoute) => {
      let text = matchedRoute.name;
      let to = matchedRoute.path;
  
      if (matchedRoute.name === 'Detail' && route.params.slugMovie) {
        text = movieName.value || route.params.slugMovie;
      } else if (matchedRoute.name === 'Player') {
        if (route.params.slugEpisode) {
          return [
            {
              text: movieName.value || route.params.slugMovie,
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
    }).flat();
  
    return [homeBreadcrumb, ...routeBreadcrumbs];
  });
  
  onMounted(() => {
    if (route.params.slugMovie) {
      getMovieName(route.params.slugMovie);
    }
  });
  
  watch(() => route.params.slugMovie, (newSlug) => {
    if (newSlug) {
      getMovieName(newSlug);
    }
  });
  </script>
  