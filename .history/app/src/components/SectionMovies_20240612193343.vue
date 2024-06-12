<template>
  <v-container fluid class="mt-n10">
    <v-row>
      <v-col :cols="isMobile ? 12 : 8">
        <Suspense>
          <template #default>
            <movie-list
              :movies="movies"
              :totalPages="totalPages"
              :currentPage="currentPage"
              @update:currentPage="currentPage = $event"
            />
          </template>
          <template #fallback>
            <v-progress-circular
              class="loadingAnimation"
              color="primary"
              indeterminate
            />
          </template>
        </Suspense>
      </v-col>

      <v-col cols="4">
        <newly-movies />
        <facebook-comments class="mt-4" href="https://motphimmoi.com" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useHead } from '@unhead/vue';
import { toast } from 'vue3-toastify';
import { useRoute } from 'vue-router';

const route = useRoute();
const moviesKey = 'section_movies';
const totalPagesKey = 'section_movies_total_pages';

const movies = ref([]);
const totalPages = ref(1);
const currentPage = ref(Number(route.query.page) || 1);

const updateMetaTitle = () => useHead({ title: 'Mọt Phim Mới - motphimmoi.com' });

const getMovies = async (page) => {
  try {
    const { data } = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
    movies.value = data.items;
    totalPages.value = data.pagination.totalPages;
    localStorage.setItem(moviesKey, JSON.stringify(data.items));
    localStorage.setItem(totalPagesKey, JSON.stringify(data.pagination.totalPages));
  } catch {
    toast.error('Không thể tải danh sách phim!');
  } finally {
    updateMetaTitle();
  }
};

const prefetchNextPage = async (page) => {
  if (page < totalPages.value) getMovies(page + 1);
};

watch(() => route.query.page, (newPage) => {
  const page = Number(newPage) || 1;
  currentPage.value = page;
  getMovies(page);
  prefetchNextPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, { immediate: true });

watch(currentPage, (newPage) => router.push({ query: { page: newPage } }));

onMounted(() => {
  movies.value = JSON.parse(localStorage.getItem(moviesKey)) || [];
  totalPages.value = JSON.parse(localStorage.getItem(totalPagesKey)) || 1;
});
</script>

