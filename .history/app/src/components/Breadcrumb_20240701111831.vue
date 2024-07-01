<template>
    <v-breadcrumbs>
      <v-breadcrumbs-item v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.to" exact>
        {{ crumb.text }}
      </v-breadcrumbs-item>
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
      const matchedRoute = router.resolve(to).route.matched.find((match) => match.path === to);
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
  