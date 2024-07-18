<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMovieStore } from "@/stores/useMovieStore";
import { useWindowSize } from "@vueuse/core";
const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const movieStore = useMovieStore();

const movies = computed(() => movieStore.movies[props.apiKey] || []);
const currentSlide = ref(0);

const navigateToDetail = (slug) =>
  router.push({ name: "Detail", params: { slugMovie: slug } });

movieStore.getMovies(props.apiKey);
</script>

<template>
  <v-carousel
    v-if="!isSmallTabletAndMobile"
    cycle
    hide-delimiters
    interval="5000"
    height="90vh"
    v-model="currentSlide"
  >
    <v-carousel-item v-for="movie in movies" :key="movie._id">
      <v-img
        class="d-flex align-end w-100 h-100"
        :src="`https://apii.online/image/${movie.poster_url}`"
        loading="lazy"
        cover
        alt="poster"
      >
        <div class="movie-details d-flex align-end ml-3">
          <v-img
            :src="`https://apii.online/image/${movie.thumb_url}`"
            loading="lazy"
            width="150"
            height="auto"
            alt="thumbnail"
          />
          <div class="w-100 ml-12 mb-8">
            <div class="movie-title">{{ movie.name }}</div>
            <div class="movie-origin">{{ movie.origin_name }}</div>
            <div class="movie-year">
              {{ movie.year }} | {{ movie.epis }}
            </div>
            <v-btn
              color="red-darken-1"
              height="40"
              class="mt-3 mb-n1"
              @click="navigateToDetail(movie.slug)"
              >{{ $t("moreInfo") }}</v-btn
            >
          </div>
        </div>
      </v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
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
  color: #d3d3d3;
}

.movie-year {
  font-size: 17px;
  color: white;
}
</style>
