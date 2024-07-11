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
  <v-card width="" @click="navigateToDetail">
    <v-img
      max-height="220"
      :src="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
      alt="thumbnail"
      loading="lazy"
      @load="() => (loadedThumb[movie._id] = true)"
    />
    <v-card-title class="text-subtitle-1 text-center" v-if="movie.name">
      {{ movie.name }}
    </v-card-title>
    <v-card-text
      class="text-subtitle-2 text-center text_effect"
      v-if="movie.origin_name"
    >
      {{ movie.origin_name }}
    </v-card-text>
    <v-badge
      v-show="loadedThumb[movie._id]"
      color="red"
      class="year-badge pa-2 position-absolute"
      :content="movie.year"
    ></v-badge>
    <v-badge
      v-show="loadedThumb[movie._id]"
      color="yellow"
      class="score-badge pa-2 position-absolute"
    >
      <template v-slot:badge>
        <v-icon left small class="pr-2">mdi-star</v-icon>
        <span>{{ movie.tmdb?.vote_average }}</span>
      </template>
    </v-badge>
  </v-card>
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