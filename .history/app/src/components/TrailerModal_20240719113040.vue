<script setup>
import { computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["close"]);

const embedUrl = computed(() => {
  const videoId = props.url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
});

const close = () => {
  emit("close");
};
</script>

<template>
  <v-dialog
    v-model="props.show"
    width="70%"
    @click="close"
    opacity="0.1"
  >
    <iframe
      :src="embedUrl"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      class="w-100"
      style="height: calc(80vh - 60px);"
    ></iframe>
  </v-dialog>
</template>

<style scoped>
</style>
