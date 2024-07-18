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
  facebookStore.initFacebookPlugin();
});
</script>

<template>
  <v-container>
    <div
      style="width: 100%; background-color: white"
    class="pt-2"
    >
    <div>
      <h3 class="d-flex justify-start animate-charcter">
        {{ $t('QA') }}
      </h3>
      <div class="line" />
    </div>
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
  </v-container>
</template>

<style scoped>

</style>