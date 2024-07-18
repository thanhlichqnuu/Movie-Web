<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const loadedThumb = ref({});

const navigateToDetail = () => {
  router.push({
    name: "Detail",
    params: { slugMovie: props.movie.slug },
  });
};
</script>

<template>
  <v-card @click="navigateToDetail">
    <v-img
    class="movie-thumb mx-auto"
      
      max-height="100%"
      :src="`https://apii.online/image/${movie.thumb_url}`"
      alt="thumbnail"
      loading="lazy"
      @load="() => (loadedThumb[movie._id] = true)"
    />
    <v-card-title class="text-subtitle-2 text-center" v-if="movie.name">
      {{ movie.name }}
    </v-card-title>
    <v-card-text
      class="text-center text_effect"
      style="font-size: 13px"
      v-if="movie.origin_name"
    >
      {{ movie.origin_name }}
    </v-card-text>
    <v-badge
      v-show="loadedThumb[movie._id]"
      color="red"
      class="year-badge pa-1 position-absolute"
      :content="movie.year"
    ></v-badge>
    <v-badge
      v-show="loadedThumb[movie._id]"
      color="blue"
      class="episode-badge pa-1 position-absolute"
      :content="movie.episode_current"
    >  
    </v-badge>
  </v-card>
</template>

<style scoped>
.text_effect {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.episode-badge {
  top: 10px;
  left: 10%;
}

.year-badge {
  top: 10px;
  left: 78%;
}

@media (max-width: 1024px) {
  .movie-thumb {
    max-width: 100%;
    aspect-ratio: 0.8;
  }
}
</style>