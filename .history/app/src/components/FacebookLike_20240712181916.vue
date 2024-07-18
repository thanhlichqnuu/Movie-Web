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


</script>

<template>
  <div>
    <div class="fb-like" data-href="https://motphimmoi.com" data-width="" data-layout="" data-action="" data-size="" data-share="true"></div>
  </div>
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
