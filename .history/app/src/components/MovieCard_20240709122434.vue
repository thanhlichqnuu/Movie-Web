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
    <div>

    </div>
    <v-img
      max-height="220"
      :src="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
      alt="thumbnail"
      loading="lazy"
      @load="() => (loadedThumb[movie._id] = true)"
    /
    >
    <v-card-title class="text-center text-subtitle-2" v-if="movie.name">
      {{ movie.name }}
    </v-card-title>
    <v-card-text
      class="text-center text_effect"
      style="font-size: 13px; font-weight: 500; color: #7d7d7d"
      v-if="movie.origin_name"
    >
      {{ movie.origin_name }}
    </v-card-text>

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