<script setup>
import { useFacebookStore } from "@/stores/useFacebookStore";

const facebookStore = useFacebookStore();
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
});

facebookStore.initFacebookPlugin();
</script>

<template>
  <div>
    <div>
      <h3 class="d-flex justify-start">
        {{ $t("QA") }}
      </h3>
      <div class="line" />
    </div>
    <div
      class="fb-comments"
      :data-href="href"
      data-width="70"
      data-numposts="5"
    ></div>
  </div>
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
