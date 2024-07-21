<script setup>
import { useFacebookStore } from "@/stores/useFacebookStore";

const facebookStore = useFacebookStore();
const props = defineProps({
  hreff: {
    type: String,
    required: true,
  },
});

facebookStore.initFacebookPlugin();
</script>

<template>
  <v-container>
    <div>
      <h3 class="d-flex justify-start">Plugin Facebook</h3>
      <div class="line" />
    </div>
    <div style="width: 100%; background-color: white" class="pt-2">
      <div
        class="fb-like"
        :data-href="hreff"
        data-width=""
        data-layout="button_count"
        data-action="like"
        data-size="small"
        data-share="true"
      ></div>
    </div>
  </v-container>
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
