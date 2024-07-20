<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["closeTrailerModal"]);
const isLandscapeMobile = ref(false);
const isMobile = /iPhone|Android|Windows Phone|BlackBerry/i.test(
    navigator.userAgent
  );
  
const embedUrl = computed(() => {
  const videoId = props.url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
});

const closeTrailerModal = () => {
  emit("closeTrailerModal");
};

const handleOrientationChange = () => {
  const mediaQuery = window.matchMedia("(orientation: landscape)");
  isLandscapeMobile.value = isMobile && mediaQuery.matches;
};

onMounted(() => {
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
    @click="closeTrailerModal"
    opacity="0.1"
  >
    <iframe
      :src="embedUrl"
      :class="[
              isMobile ? 'video-player_mobile' : 'video-player_pc',
              isLandscapeMobile ? 'video-player_landscape_mobile' : ''
            ]"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen

    ></iframe>
  </v-dialog>
</template>

<style scoped>
.video-player_mobile {
  width: 100%;
  height: calc(60vh - 60px)
}

.video-player_pc {
  width: 100%;
  height: calc(80vh - 60px)
}

.video-player_landscape_mobile {
  width: 100%;
  height: calc(100vh - 60px)
}
</style>
