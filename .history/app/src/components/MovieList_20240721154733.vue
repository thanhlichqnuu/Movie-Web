<script setup>
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import MovieCard from "@/components/MovieCard.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(["updateCurrentPage"]);

const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 640);
</script>

<template>
  <v-main>
    <v-row class="d-flex justify-start align-center" v-if="movies">
      <v-col
        :cols="isMobile ? 6 : 12"
        :md="isMobile ? null : 3"
        :sm="isMobile ? null : 4"
        v-for="movie in movies"
        :key="movie._id"
      >
        <movie-card :movie="movie" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-progress-circular
        class="animation_loading"
        color="primary"
        indeterminate
      />
    </v-row>
    <v-pagination
      :modelValue="currentPage"
      :length="totalPages"
      @update:modelValue="$emit('updateCurrentPage', $event)"
    />
  </v-main>
</template>

<style scoped>
.animation_loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
