<template>
    <v-breadcrumbs>
      <v-breadcrumbs-item
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        :disabled="index === breadcrumbs.length - 1"
        :href="breadcrumb.href"
      >
        {{ breadcrumb.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const breadcrumbs = computed(() => {
    const paths = route.path.split('/').filter(path => path);
    return paths.map((path, index) => {
      const breadcrumbPath = `/${paths.slice(0, index + 1).join('/')}`;
      const routeName = router.resolve(breadcrumbPath).name;
      const text = routeName.replace('-route', '').replace(/([A-Z])/g, ' $1').toUpperCase();
      return {
        text: text.charAt(0).toUpperCase() + text.slice(1),
        href: breadcrumbPath,
      };
    });
  });
  </script>
  
  <style scoped>

  </style>
  