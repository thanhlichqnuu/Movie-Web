<script setup>
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { onMounted } from "vue";
const themeStore = useStateThemeStore()


</script>

<template>
  <div>
    <router-view />
  </div>
</template>
