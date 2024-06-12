<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const tabs = ref([
  { name: 'Mới cập nhật', api: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1' },
  { name: 'Anime', api: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1' },
  { name: 'Series', api: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1' },
  { name: 'Movie', api: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1' },
]);

const router = useRouter();
const currentTab = ref(tabs.value[0].name);
const movies = ref([]);

const getMovies = async (api) => {
  try {
    const res = await axios.get(api);
    if (res.data.data && res.data.data.items) {
      movies.value = res.data.data.items.slice(0, 10);
    } else {
      movies.value = res.data.items.slice(0, 10);
    }
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }
};

onMounted(() => {
  getMovies(tabs.value[0].api); 
});

const changeTab = (tab) => {
  currentTab.value = tab.name;
  fetchMovies(tab.api);
};

const navigateToDetail = (slug) => {
  router.push({ name: 'detail-route', params: { slugMovie: slug } });
};
</script>

<template>
  <v-main>
    <v-tabs v-model="currentTab">
    <v-tab class="text-subtitle-1" v-for="tab in tabs" :key="tab.name" @click="changeTab(tab)">
      {{ tab.name }}
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
      <v-list-item class="mt-n5 ml-n4 w-100">
        <div class="d-flex">
          <v-card-title class="text-subtitle-2">{{ movie.name }}</v-card-title>
          <v-badge color="transparent" class="hot-badge ml-n2 mt-4">
            <div class="burning-text">HOT</div>
          </v-badge>
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

@keyframes burn {
  0% {
    text-shadow: 0 0 5px #ff0, 0 0 10px #ff0, 0 0 15px #ff0, 0 0 20px #ff8000,
      0 0 30px #ff8000, 0 0 40px #ff8000, 0 0 50px #ff0000, 0 0 75px #ff0000,
      0 0 100px #ff0000;
    color: #fff;
  }
  50% {
    text-shadow: 0 0 5px #ff8000, 0 0 10px #ff8000, 0 0 15px #ff8000,
      0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #800000,
      0 0 75px #800000, 0 0 100px #800000;
    color: #ff0;
  }
  100% {
    text-shadow: 0 0 5px #ff0, 0 0 10px #ff0, 0 0 15px #ff0, 0 0 20px #ff8000,
      0 0 30px #ff8000, 0 0 40px #ff8000, 0 0 50px #ff0000, 0 0 75px #ff0000,
      0 0 100px #ff0000;
    color: #fff;
  }
}

.burning-text {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  animation: burn 2s infinite alternate;
  color: white;
}
</style>
