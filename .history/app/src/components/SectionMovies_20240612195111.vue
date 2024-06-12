<script setup>
import { ref, watch, useLocalStorage } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useHead } from '@unhead/vue';
import NewlyMovies from '@/components/NewlyMovies.vue';
import FacebookComments from '@/components/FacebookComments.vue';
import MovieList from '@/components/MovieList.vue';

const route = useRoute();
const router = useRouter();
const currentPage = ref(Number(route.query.page) || 1);
const [cachedMovies, setCachedMovies] = useLocalStorage('cached_movies', {});

const updateMetaTitle = () => useHead({ title: 'Mọt Phim Mới - motphimmoi.com' });

const fetchMovies = async (page) => {
  try {
    const cacheKey = `all_movies_page_${page}`;
    if (!cachedMovies[cacheKey]) {
      const { data } = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
      cachedMovies[cacheKey] = { items: data.items, totalPages: data.pagination.totalPages };
      setCachedMovies(cachedMovies);
    }
    return cachedMovies[cacheKey];
  } catch {
    toast.error('Không thể tải danh sách phim!');
  } finally {
    updateMetaTitle();
  }
};

const prefetchNextPage = async (page) => {
  const nextPage = page + 1;
  await fetchMovies(nextPage);
};

watch(() => route.query.page, async (newPage) => {
  const page = Number(newPage) || 1;
  currentPage.value = page;
  await fetchMovies(page);
  await prefetchNextPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, { immediate: true });

watch(currentPage, (newPage) => router.push({ query: { page: newPage } }));

fetchMovies(currentPage.value);
prefetchNextPage(currentPage.value);
</script>

<template>
  <v-container fluid class="mt-n10">
    <v-row>
      <v-col :cols="isMobile ? 12 : 8">
        <movie-list
          :movies="cachedMovies[`all_movies_page_${currentPage}`]?.items || []"
          :totalPages="cachedMovies[`all_movies_page_${currentPage}`]?.totalPages || 1"
          :currentPage="currentPage"
          @update:currentPage="currentPage = $event"
        />
      </v-col>

      <v-col cols="4">
        <newly-movies />
        <facebook-comments class="mt-4" href="https://motphimmoi.com" />
      </v-col>
    </v-row>
  </v-container>
</template>
