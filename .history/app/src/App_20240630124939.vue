<script setup>
import { onMounted } from 'vue';
onMounted(() => {
document.cookie = 'locale'
})
</script>

<template>
  <div>
    <router-view />
  </div>
</template>
