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

const currentTab = ref(tabs.value[0].name);
const movies = ref([]);

const fetchMovies = async (api) => {
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
  fetchMovies(tabs.value[0].api); 
});

const changeTab = (tab) => {
  currentTab.value = tab.name;
  fetchMovies(tab.api);
};

const router = useRouter();

const navigateToDetail = (slug) => {
  router.push({ name: 'detail-route', params: { slugMovie: slug } });
};
</script>

<template>
  <v-main>
    
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
