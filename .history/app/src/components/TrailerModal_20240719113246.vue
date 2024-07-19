<script setup>
import { computed, onMounted, onUnmounted } from "vue";

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
const isLandscapeMobile = ref(false);
const isMobile = /iPhone|Android|Windows Phone|BlackBerry/i.test(
    navigator.userAgent
  );


const embedUrl = computed(() => {
  const videoId = props.url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
});

const close = () => {
  emit("close");
};

const handleOrientationChange = () => {
  const mediaQuery = window.matchMedia("(orientation: landscape)");
  isLandscapeMobile.value = isMobile && mediaQuery.matches;
};

onMounted(() => {
  getMoviePlay(route.params.slugMovie);

  handleOrientationChange();
  window.matchMedia("(orientation: landscape)").addEventListener("change", handleOrientationChange);
});

onUnmounted(() => {
  window.matchMedia("(orientation: landscape)").removeEventListener("change", handleOrientationChange);
});
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
  width: 45%;
}

.video-player_pc {
  width: 70%;
}

.video-player_landscape_mobile {
  width: 90%;
}
</style>
