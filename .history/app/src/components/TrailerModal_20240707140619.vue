<script setup>
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  show: {
    type: Boolean,
    require
  }
});
const emit = defineEmits(["close"]);
const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);

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
    v-if="!isSmallTabletAndMobile"
      :src="embedUrl"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      class="w-100"
      style="height: calc(80vh - 60px);"
    ></iframe>
    <iframe
    v-if="isSmallTabletAndMobile"
      :src="embedUrl"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      class="w-100"
      style="height: calc(50vh - 60px);"
    ></iframe>
  </v-dialog>
</template>

