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

const scrollTopPage = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <v-main>
    <v-row class="movie-row" v-if="movies">
      <div
        class="movie-col"
        v-for="movie in movies"
        :key="movie._id"
      >
        <movie-card :movie="movie" />
      </div>
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
      @click="scrollTopPage"
    />
  </v-main>
</template>

<style scoped>
.loadingAnimation {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.movie-row {
  display: flex;
  flex-wrap: wrap;
}

.movie-col {
  flex: 1 1 20%; 
  max-width: 20%;
  box-sizing: border-box;
padding: 9px;
}

@media (max-width: 1024px) {
  .movie-col {
    flex: 1 1 25%; 
    max-width: 25%;
  }
}

@media (max-width: 768px) {
  .movie-col {
    flex: 1 1 33.33%; 
    max-width: 33.33%;
  }
}

@media (max-width: 600px) {
  .movie-col {
    flex: 1 1 50%; 
    max-width: 50%;
  }
}
</style>
