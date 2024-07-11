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
  <v-main>
    <div>
      <h3 class="d-flex justify-start animate-charcter">
        Q&A 
      </h3>
      <div class="line" />
    </div>
  <div
    class="fb-comments"
    :data-href="href"
    data-width="100%"
    data-numposts="5"
  ></div>
  </v-main>
  
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
