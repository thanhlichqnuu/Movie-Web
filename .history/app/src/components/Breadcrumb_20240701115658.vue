<template>
    <v-breadcrumbs :items="breadcrumbs" divider="/">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to">
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  
  const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched
    const homeBreadcrumb = {
      text: 'Home',
      to: '/',
    }
    
    const routeBreadcrumbs = matchedRoutes.map((matchedRoute) => {
      let text = matchedRoute.name
      if (matchedRoute.name === "Detail" && route.params.slugMovie) {
        text = route.params.slugMovie
      } else if (matchedRoute.name === "player-route" && route.params.slugEpisode) {
        text = route.params.slugEpisode
      }
      return {
        text,
        to: matchedRoute.path,
      }
    })
  
    return [homeBreadcrumb, ...routeBreadcrumbs]
  })
  </script>
  
  <style scoped>
  .v-breadcrumbs {
    padding: 16px;
  }
  </style>
  