<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useHead } from '@unhead/vue';
import { get, set } from 'idb-keyval';
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

const updateMetaTitle = () => useHead({ title: 'Mọt Phim Mới - motphimmoi.com' });

const getMovies = async (page) => {
  try {
    const cacheKey = `animes_page_${page}`;
    const cachedMovies = await get(cacheKey);
    if (cachedMovies) {
      movies.value = cachedMovies.items;
      totalPages.value = cachedMovies.pagination.totalPages;
    } else {
      const { data } = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
      movies.value = data.items;
      totalPages.value = data.pagination.totalPages;
      set(cacheKey, {
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
    const cachedMovies = await get(`movies_page_${page + 1}`);
    if (!cachedMovies) {
      getMovies(page + 1);
    }
  }
};

watch(
  () => route.query.page,
  async (newPage) => {
    currentPage.value = Number(newPage) || 1
    await getMovies(currentPage.value);
    prefetchNextPage(currentPage.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  { immediate: true }
);

watch(currentPage, (newPage) => router.push({ query: { page: newPage } }));

getMovies(currentPage.value);
prefetchNextPage(currentPage.value);
</script>

<template>
  <v-container fluid class="mt-n10">
    <v-row>
      <v-col :cols="isMobile ? 12 : 8">
        <movie-list
          :movies="movies"
          :totalPages="totalPages"
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