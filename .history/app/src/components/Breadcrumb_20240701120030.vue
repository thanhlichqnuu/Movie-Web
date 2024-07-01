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
      let to = matchedRoute.path
  
      if (matchedRoute.name === "Detail" && route.params.slugMovie) {
        text = route.params.slugMovie
        to = `/phim/${route.params.slugMovie}`
      } else if (matchedRoute.name === "Player") {
        if (route.params.slugMovie) {
          text = route.params.slugMovie
          to = `/phim/${route.params.slugMovie}`
        }
        if (route.params.slugEpisode) {
          return [
            {
              text: route.params.slugMovie,
              to: `/phim/${route.params.slugMovie}`
            },
            {
              text: route.params.slugEpisode,
              to: matchedRoute.path
            }
          ]
        }
      }
  
      return {
        text,
        to,
      }
    }).flat()
  
    return [homeBreadcrumb, ...routeBreadcrumbs]
  })
  </script>
  
  <style scoped>
  .v-breadcrumbs {
    padding: 16px;
  }
  </style>
  