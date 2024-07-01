<template>
  <v-breadcrumbs :items="breadcrumbs" divider="/">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :to="item.to"
        :disabled="item.disabled"
      >
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
    disabled: route.path === '/' // Disable if current route is home
  }

  const routeBreadcrumbs = matchedRoutes.map((matchedRoute) => {
    let text = matchedRoute.name
    let to = matchedRoute.path
    let disabled = matchedRoute.path === route.path // Disable if current route matches

    if (matchedRoute.name === "Detail" && route.params.slugMovie) {
      text = route.params.slugMovie
      to = `/${route.params.slugMovie}`
      disabled = `/${route.params.slugMovie}` === route.path // Disable if current route matches
    } else if (matchedRoute.name === "Player") {
      if (route.params.slugMovie) {
        text = route.params.slugMovie
        to = `/${route.params.slugMovie}`
        disabled = `/${route.params.slugMovie}` === route.path // Disable if current route matches
      }
      if (route.params.slugEpisode) {
        return [
          {
            text: route.params.slugMovie,
            to: `/${route.params.slugMovie}`,
            disabled: `/${route.params.slugMovie}` === route.path // Disable if current route matches
          },
          {
            text: route.params.slugEpisode,
            to: matchedRoute.path,
            disabled: matchedRoute.path === route.path // Disable if current route matches
          }
        ]
      }
    }

    return {
      text,
      to,
      disabled
    }
  }).flat()

  return [homeBreadcrumb, ...routeBreadcrumbs]
})
</script>

<style scoped>
.v-breadcrumbs {
  padding: 16px;
}
.v-breadcrumbs-item[aria-disabled="true"] {
  pointer-events: none;
  color: grey;
}
</style>
