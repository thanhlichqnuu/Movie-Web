<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Compressor from 'compressorjs';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const loadedThumb = ref({});
const compressedThumb = ref(null);

const compressImage = (imageUrl, callback) => {
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      new Compressor(blob, {
        quality: 0.6,
        success(result) {
          const reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = () => {
            callback(reader.result);
          };
        },
        error(err) {
          console.error(err.message);
        },
      });
    })
    .catch(err => {
      console.error('Image fetch error:', err);
    });
};

const navigateToDetail = () => {
  router.push({
    name: 'Detail',
    params: { slugMovie: props.movie.slug },
  });
};

onMounted(() => {
  const imageUrl = `https://img.ophim.live/uploads/movies/${props.movie.thumb_url}`;
  compressImage(imageUrl, (compressedUrl) => {
    compressedThumb.value = compressedUrl;
    console.log('Compressed image URL:', compressedUrl);
  });
});
</script>

<template>
  <v-card @click="navigateToDetail">
    <v-img
      v-if="compressedThumb"
      max-height="250"
      :src="compressedThumb"
      alt="thumbnail"
      loading="lazy"
      @load="() => (loadedThumb[props.movie._id] = true)"
    />
    <v-card-title class="text-subtitle-1 text-center" v-if="props.movie.name">
      {{ props.movie.name }}
    </v-card-title>
    <v-card-text
      class="text-subtitle-2 text-center text_effect"
      v-if="props.movie.origin_name"
    >
      {{ props.movie.origin_name }}
    </v-card-text>
    <v-badge
      v-show="loadedThumb[props.movie._id]"
      color="red"
      class="year-badge pa-2 position-absolute"
      :content="props.movie.year"
    ></v-badge>
    <v-badge
      v-show="loadedThumb[props.movie._id]"
      color="yellow"
      class="score-badge pa-2 position-absolute"
    >
      <template v-slot:badge>
        <v-icon left small class="pr-2">mdi-star</v-icon>
        <span>{{ props.movie.tmdb?.vote_average }}</span>
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
