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
  <div style="background-color: transparent;">
    <div
    
      class="fb-like"
      :data-href="href"
      data-width="450"
      data-layout="button_count"
      data-action="like"
      data-size="small"
      data-share="true"
    ></div>
  </div>
</template>
