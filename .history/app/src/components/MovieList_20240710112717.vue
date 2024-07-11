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

const emit = defineEmits(["update:currentPage"]);

const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 640);

const scroll = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
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

    <v-row v-if="!movies">
      <v-progress-circular
        class="loadingAnimation"
        color="primary"
        indeterminate
      />
    </v-row>
    <v-pagination
      :modelValue="currentPage"
      :length="totalPages"
      @update:modelValue="$emit('update:currentPage', $event)"
      @click="sc"
    />
  </v-main>
</template>

<style scoped>
.text_effect {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-badge {
  top: 10px;
  left: 9%;
}

.year-badge {
  top: 10px;
  left: 74%;
}
</style>
