<template>
    <v-breadcrumbs :items="breadcrumbs">
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
    return matchedRoutes.map((matchedRoute) => {
      return {
        text: matchedRoute.name,
        to: matchedRoute.path,
      }
    })
  })
  </script>
  
  <style scoped>
  .v-breadcrumbs {
    padding: 16px;
  }
  </style>
  