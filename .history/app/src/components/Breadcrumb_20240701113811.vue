<template>
    <v-breadcrumbs>
      <v-breadcrumbs-item href="/" :disabled="isHome">
        Home
      </v-breadcrumbs-item>
      <v-breadcrumbs-item
        v-for="(route, index) in breadcrumbRoutes"
        :key="index"
        :href="route.path"
        :disabled="index === breadcrumbRoutes.length - 1"
      >
        {{ route.name }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const breadcrumbRoutes = computed(() => {
    const paths = route.path.split('/').filter(Boolean);
    const routes = paths.map((path, index) => {
      const fullPath = '/' + paths.slice(0, index + 1).join('/');
      const routeMatch = route.matched.find(matchedRoute => matchedRoute.path === fullPath);
      return {
        name: routeMatch?.name || path,
        path: fullPath
      };
    });
    return routes;
  });
  
  const isHome = computed(() => route.path === '/');
  </script>
  
  <style scoped>
  .v-breadcrumbs {
    padding: 16px 0;
  }
  
  .v-breadcrumbs-item {
    text-transform: capitalize;
  }
  </style>
  