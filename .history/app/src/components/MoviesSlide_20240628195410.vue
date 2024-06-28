<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMovieStore } from "@/stores/useMovieStore";
import { useWindowSize } from "@vueuse/core";
const { width: windowWidth } = useWindowSize();
const isTablet = computed(() => windowWidth.value < 768);

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const movieStore = useMovieStore();

const movies = computed(() => movieStore.movies[props.apiKey] || []);

const navigateToDetail = (slug) => router.push({ name: "detail-route", params: { slugMovie: slug } });
onMounted(() => {
  movieStore.getMovies(props.apiKey);
});
</script>

<template >
  <v-carousel v-show="!isTablet" cycle hide-delimiters interval="3000"  height="90vh">
    <v-carousel-item v-for="movie in movies" :key="movie._id">
      <v-img
        class="d-flex align-end w-100 h-100"
        cover
        :src="`https://img.ophim.live/uploads/movies/${movie.poster_url}`"
      >
        <div class="movie-details d-flex align-end">
          <v-img
            :src="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
            lazy="loading"
            width="150"
            height="auto"
          />
          <div class="w-100 ml-12 mb-8">
            <div class="movie-title">{{ movie.name }}</div>
            <div class="movie-origin">{{ movie.origin_name }}</div>
            <div class="movie-year">
              {{ movie.year }} | {{ movie.tmdb?.type.toUpperCase() }}
            </div>
            <v-btn
              color="red-darken-1"
              height="40"
              class="mt-3 mb-n1"
              @click="navigateToDetail(movie.slug)"
            >MORE INFO</v-btn>
          </div>
        </div>
      </v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<style>
.movie-details {
  background-image: linear-gradient(
    180deg,
    transparent 0%,
    transparent,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

.movie-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.movie-origin {
  font-size: 20px;
  color: #D3D3D3
}

.movie-year {
  font-size: 17px;
  color: white;
}
</style>
