<script setup>
import { useStateThemeStore } from "@/stores/useStateThemeStore";
const themeStore = useStateThemeStore()
</script>

<template>
  <div>
    <router-view />
  </div>
</template>
