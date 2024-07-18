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
    <v-container></v-container>
    <div style="max-width: 100%; background-color: white; box-sizing: border-box" class="pt-2">
        <div
      class="fb-like"
      :data-href="href"
      data-width=""
      data-layout="button_count"
      data-action="like"
      data-size="small"
      data-share="true"
    ></div>
    </div>
    
</template>
