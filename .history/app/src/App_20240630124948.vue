<script setup>
import { onMounted } from 'vue';
onMounted(() => {
document.cookie = 'locale=VI'
})
</script>

<template>
  <div>
    <router-view />
  </div>
</template>
