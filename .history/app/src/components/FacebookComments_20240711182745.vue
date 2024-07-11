<script setup>
import { onMounted } from "vue";
import { useFacebookStore } from "@/stores/useFacebookStore";

const facebookStore = useFacebookStore();
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  facebookStore.initFacebookComments();
});
</script>

<template>
  <v-container>

  </v-container>
  
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
