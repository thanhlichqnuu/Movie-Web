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
    <div class="image-wrapper">
      <v-img
        class="movie-thumb"
        :src="`https://apii.online/image/${movie.thumb_url}`"
        alt="thumbnail"
        loading="lazy"
        @load="() => (loadedThumb[movie._id] = true)"
      />
    </div>
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
    ></v-badge>
  </v-card>
</template>

<style scoped>
.text_effect {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 150%; /* This maintains a 2:3 aspect ratio */
  position: relative;
  overflow: hidden;
}

.movie-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* This ensures the image covers the entire div without distorting */
}

.episode-badge {
  top: 10px;
  left: 10%;
}

.year-badge {
  top: 10px;
  left: 78%;
}
</style>
