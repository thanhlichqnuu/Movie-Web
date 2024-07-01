<script setup>
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import MovieCard from "@/components/MovieCard.vue";

const props = defineProps({
  movies: Array,
  totalPages: Number,
  currentPage: Number,
});

const emit = defineEmits(["update:currentPage"]);

const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 640);
</script>

<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-start align-center" v-show="movies.length">
        <v-col
          v-for="movie in movies"
          :key="movie._id"
          :cols="isMobile ? 6 : 12"
          md="3"
          sm="4"
          class="custom-col"
        >
          <movie-card :movie="movie" />
        </v-col>
      </v-row>

      <v-row v-show="!movies.length">
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
      />
    </v-container>
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

@media (min-width: 960px) {
  .custom-col {
    flex: 0 0 20%; /* 20% width for 5 columns per row */
    max-width: 20%; /* Ensure max width is also 20% */
  }
}
</style>
