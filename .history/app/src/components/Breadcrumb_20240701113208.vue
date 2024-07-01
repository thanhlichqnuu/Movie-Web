<template>
    <v-breadcrumbs :items="breadcrumbs">
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const breadcrumbs = computed(() => {
    const pathArray = route.path.split('/').filter(p => p);
    const breadcrumbs = pathArray.map((path, index) => {
      const to = '/' + pathArray.slice(0, index + 1).join('/');
      const routeMatch = router.resolve(to);
      const text = routeMatch.meta?.title || routeMatch.name || path;
  
      return {
        text,
        disabled: index === pathArray.length - 1,
        href: to,
      };
    });
  
    return [
      { text: 'Home', disabled: route.path === '/', href: '/' },
      ...breadcrumbs,
    ];
  });
  </script>
  
  <style scoped>
  /* Add any styles for your breadcrumb component if needed */
  </style>
  