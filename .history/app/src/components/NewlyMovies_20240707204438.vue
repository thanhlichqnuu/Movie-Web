<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from "vue3-toastify";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const movieLabel = computed(() => t('singleMovie'));
const seriesLabel = computed(() => t('seriesMovie'));

const tabs = ref([
  { name: 'Anime', api: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1' },
  { name: movieLabel, api: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1' },
  { name: seriesLabel, api: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1' },
  { name: 'TV Show', api: 'https://ophim1.com/v1/api/danh-sach/tv-shows?page=1' },
]);

const router = useRouter();
const currentTab = ref(tabs.value[0].name);
const movies = ref([]);


const getMovies = async (api) => {
  try {
    const res = await axios.get(api);
    movies.value = (res.data.data && res.data.data.items) ? res.data.data.items.slice(0, 5) : res.data.items.slice(0, 5);
  } catch {
    toast.error('Newly movie is currently unavailable!');
  }
};

onMounted(() => {
  getMovies(tabs.value[0].api); 
});

const changeTab = (tab) => {
  currentTab.value = tab.name;
  tabs.value.forEach(t => t.isActive = (t.name === tab.name));
  getMovies(tab.api);
};

const navigateToDetail = (slug) => {
  router.push({ name: 'Detail', params: { slugMovie: slug } });
};
</script>

<template>
  <v-main>
    <h3 class="d-flex justify-center rainbow-text">Last Update</h3>
    <v-tabs v-model="currentTab">
      <v-tab v-for="tab in tabs" :key="tab.name" @click="changeTab(tab)" class="tab-active">
        {{ tab.name }}
        <div v-if="tab.isActive" class="tab-indicator"></div>
      </v-tab>
    </v-tabs>
  
  <v-card
    v-for="movie in movies"
    :key="movie._id"
    @click="navigateToDetail(movie.slug)"
    class="mb-3"
  >
    <div class="d-flex">
      <v-img
        :src="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
        lazy="loading"
        style="width: 65px; height: auto"
      ></v-img>
      <v-list-item class="mt-n5 w-100">
        <div class="d-flex">
          <v-card-title class="text-subtitle-2">{{ movie.name }}</v-card-title>
        </div>
        <v-badge color="red" class="ml-7 mb-2">
          <template v-slot:badge>
            <span>{{ movie.year }}</span>
          </template>
        </v-badge>
        <v-badge color="blue" class="ml-12 mb-2">
          <template v-slot:badge>
            <span>Season {{ movie.tmdb.season ? movie.tmdb.season : 1 }}</span>
          </template>
        </v-badge>
        <v-badge color="green" class="mb-2" style="margin-left: 71px">
          <template v-slot:badge>
            <span>{{ movie.tmdb.type?.toUpperCase() }}</span>
          </template>
        </v-badge>
      </v-list-item>
    </div>
  </v-card>
  </v-main>
  
</template>

<style>
.tab-indicator {
  height: 3px;
  background-color: white;
  width: 100%;
  position: absolute;
  bottom: 0;
}

.rainbow-text {
  font-size: 24px;
  font-weight: bold;
  background-image: linear-gradient(45deg, violet, indigo, blue, green, yellow, orange, red);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
