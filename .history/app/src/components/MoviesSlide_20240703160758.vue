<script setup>
import { ref, computed, onMounted } from "vue";
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

const navigateToDetail = (slug) => router.push({ name: "Detail", params: { slugMovie: slug } });

onMounted(() => {
  movieStore.getMovies(props.apiKey);
  
});
</script>

<template>
  <div v-if="!isSmallTabletAndMobile">
    <splide 
      :options="{ 
        type: 'loop', 
        autoplay: true, 
        interval: 5000, 
        heightRatio: 0.4, 
        pagination: false,
        start: 0
      }" 
      v-model="currentSlide"
    >
      <splide-slide v-for="movie in movies" :key="movie._id">
        <v-img
          class="d-flex align-end w-100 h-100"
          :src="`https://img.ophim.live/uploads/movies/${movie.poster_url}`"
          lazy="loading"
          cover
          alt="poster"
        >
          <div class="movie-details d-flex align-end ml-3">
            <v-img
              :src="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
              lazy="loading"
              width="150"
              height="auto"
              alt="thumbnail"
            />
            <div class="w-100 ml-12 mb-8">
              <div class="movie-title">{{ movie.name }}</div>
              <div class="movie-origin">{{ movie.origin_name }}</div>
              <div class="movie-year">
                {{ movie.year }} | {{ movie.tmdb?.type?.toUpperCase() }}
              </div>
              <v-btn
                color="red-darken-1"
                height="40"
                class="mt-3 mb-n1"
                @click="navigateToDetail(movie.slug)"
              >{{ $t('moreInfo') }}</v-btn>
            </div>
          </div>
        </v-img>
      </splide-slide>
    </splide>
  </div>
</template>

<style>
@import '@splidejs/splide/dist/css/splide.min.css';

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
