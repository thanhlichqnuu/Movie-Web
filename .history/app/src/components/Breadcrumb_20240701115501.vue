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
      return {
        text: matchedRoute.name,
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
  