<template>
    <v-breadcrumbs>
      <template v-for="(crumb, index) in breadcrumbs" key="index">
        <v-breadcrumbs-item :to="crumb.to" exact>
          {{ crumb.text }}
        </v-breadcrumbs-item>
        <v-breadcrumbs-divider v-if="index < breadcrumbs.length - 1">/</v-breadcrumbs-divider>
      </template>
    </v-breadcrumbs>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const breadcrumbs = computed(() => {
    const pathArray = route.path.split('/').filter((path) => path);
    const crumbs = pathArray.map((path, index) => {
      const to = '/' + pathArray.slice(0, index + 1).join('/');
      const matchedRoute = router.getRoutes().find((match) => match.path === to);
  
      return {
        text: matchedRoute ? matchedRoute.name.replace(/-route$/, '').replace(/-/g, ' ').toUpperCase() : path,
        to,
      };
    });
  
    return [{ text: 'Home', to: '/' }, ...crumbs];
  });
  </script>
  
  <style scoped>
  .v-breadcrumbs {
    padding: 0;
  }
  </style>
  