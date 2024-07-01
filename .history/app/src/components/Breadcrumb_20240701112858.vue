<template>
  <v-breadcrumbs>
    <v-container v-for="(crumb, index) in breadcrumbs" :key="index">
      <v-breadcrumbs-item :to="crumb.to" exact>
        {{ crumb.text }}
      </v-breadcrumbs-item>
      <v-breadcrumbs-divider v-if="index < breadcrumbs.length - 1">/</v-breadcrumbs-divider>
    </>
  </v-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Get the current route
const route = useRoute();
// Get the router instance
const router = useRouter();

// Compute the breadcrumbs
const breadcrumbs = computed(() => {
  // Split the current path into an array, filtering out empty strings
  const pathArray = route.path.split('/').filter((path) => path);

  // Map each part of the path to a breadcrumb object
  const crumbs = pathArray.map((path, index) => {
    // Recreate the path up to the current index
    const to = '/' + pathArray.slice(0, index + 1).join('/');

    // Find the matched route for the current path
    const matchedRoute = router.getRoutes().find((match) => match.path === to);

    return {
      // Use the matched route name if available, otherwise use the path
      text: matchedRoute ? matchedRoute.name.replace(/-route$/, '').replace(/-/g, ' ').toUpperCase() : path,
      to,
    };
  });

  // Always include the Home breadcrumb at the start
  return [{ text: 'Home', to: '/' }, ...crumbs];
});
</script>

<style scoped>
.v-breadcrumbs {
  padding: 0;
}
</style>
