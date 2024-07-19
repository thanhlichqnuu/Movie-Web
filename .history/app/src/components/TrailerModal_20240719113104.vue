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
.video-player_mobile {
  width: 100%;
  height: 50vh;
}

.video-player_pc {
  width: 70%;
}

.video-player_landscape_mobile {
  width: 100%;
  height: 90vh;
}
</style>
