<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize, useLocalStorage } from '@vueuse/core';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useHead } from '@unhead/vue';

import NewlyMovies from '@/components/NewlyMovies.vue';
import FacebookComments from '@/components/FacebookComments.vue';
import MovieList from '@/components/MovieList.vue';

const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 640);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const updateMetaTitle = () => {
  useHead({
    title: 'Mọt Phim Mới - motphimmoi.com',
  });
};

const [getMoviesCache, setMoviesCache] = useLocalStorage('movies_cache');

const getMovies = async (page) => {
  try {
    const cacheKey = `all_movies_page_${page}`;
    const cachedMovies = getMoviesCache(cacheKey);
    if (cachedMovies) {
      movies.value = cachedMovies.items;
      totalPages.value = cachedMovies.pagination.totalPages;
    } else {
      const { data } = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
      movies.value = data.items;
      totalPages.value = data.pagination.totalPages;
      setMoviesCache(cacheKey, {
        items: data.items,
        pagination: { totalPages: totalPages.value },
      });
    }
  } catch {
    toast.error('Không thể tải danh sách phim!');
  } finally {
    updateMetaTitle();
  }
};

const prefetchNextPage = async (page) => {
  if (page < totalPages.value) {
    const nextPage = page + 1;
    const cacheKey = `movies_page_${nextPage}`;
    const cachedMovies = getMoviesCache(cacheKey);
    if (!cachedMovies) {
      getMovies(nextPage);
    }
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage) || 1;
    currentPage.value = page;
    getMovies(page);
    prefetchNextPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  { immediate: true }
);

watch(currentPage, (newPage) => {
  router.push({ query: { page: newPage } });
});

getMovies(currentPage.value);
prefetchNextPage(currentPage.value);
</script>
