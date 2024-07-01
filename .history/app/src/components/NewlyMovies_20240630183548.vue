<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@/stores/useLocaleStore';

const localeStore = useLocaleStore()
const { t } = useI18n();

const tabs = ref([
  { name: t('lastUpdate'), api: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1' },
  { name: "ANIME", api: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1' },
  { name: "SERIES", api: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1' },
  { name: "MOVIE", api: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1' },
]);

const router = useRouter();
const currentTab = ref(tabs.value[0].name);
const movies = ref([]);

const getMovies = async (api) => {
  try {
    const res = await axios.get(api);
    movies.value = (res.data.data && res.data.data.items) ? res.data.data.items.slice(0, 10) : res.data.items.slice(0, 10);
  } catch {
    toast.error('Không thể tải dữ liệu!');
  }
};

watch(locale, (newLocale) => {
  tabs.value = [
    { name: t('lastUpdate'), api: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1' },
    { name: "ANIME", api: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1' },
    { name: "SERIES", api: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1' },
    { name: "MOVIE", api: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1' },
  ];
  currentTab.value = tabs.value[0].name;
  getMovies(tabs.value[0].api);
});

onMounted(() => {
  getMovies(tabs.value[0].api);
});

const changeTab = (tab) => {
  currentTab.value = tab.name;
  tabs.value.forEach(t => t.isActive = (t.name === tab.name));
  getMovies(tab.api);
};

const navigateToDetail = (slug) => {
  router.push({ name: 'detail-route', params: { slugMovie: slug } });
};
</script>

<template>
  <v-main>
    <v-tabs v-model="currentTab">
      <v-tab v-for="tab in tabs" :key="tab.name" @click="changeTab(tab)" :class="{ 'tab-active': tab.isActive }">
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
              <v-icon left small class="pr-2">mdi-calendar</v-icon>
              <span>{{ movie.year }}</span>
            </template>
          </v-badge>
          <v-badge color="blue" class="ml-14 mb-2">
            <template v-slot:badge>
              <span>Season {{ movie.tmdb.season ? movie.tmdb.season : 1 }}</span>
            </template>
          </v-badge>
          <v-badge color="green" class="type-badge mb-2">
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
.type-badge {
  margin-left: 71px;
}

.tab-indicator {
  height: 3px;
  background-color: white;
  width: 100%;
  position: absolute;
  bottom: 0;
}

.tab-active {
  color: white;
}
</style>
