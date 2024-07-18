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

onMounted(async () => {
  await facebookStore.initFacebookComments();
  // Ensure element exists before calling parse
  if (document.querySelector('.fb-like')) {
    window.FB.XFBML.parse(document.querySelector('.fb-like').parentElement);
  }
});
</script>

<template>
  <div>
    <div class="fb-like"
      :data-href="href"
      data-width="100%"
      data-layout="button_count"
      data-action="like"
      data-size="small"
      data-share="true">
    </div>
  </div>
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
