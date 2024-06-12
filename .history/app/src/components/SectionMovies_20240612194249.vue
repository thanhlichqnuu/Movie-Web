<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import axios from 'axios';
import { useHead } from '@unhead/vue';
import { useLocalStorage } from '@vueuse/core';


const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isMobile = ref(windowWidth < 640);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

useHead({
  title: 'Mọt Phim Mới - motphimmoi.com',
});



const getMovies = async (page) => {
  try {
    const cacheKey = `all_movies_page_${page}`;
    const { data } = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
    movies.value = data.items;
    totalPages.value = data.pagination.totalPages;
    useLocalStorage(cacheKey, data);
  } catch {

  }
};

const prefetchNextPage = async (page) => {
  if (page < totalPages.value) {
    const nextPage = page + 1;
    const cacheKey = `movies_page_${nextPage}`;
    const cachedMovies = JSON.parse(localStorage.getItem(cacheKey));
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
