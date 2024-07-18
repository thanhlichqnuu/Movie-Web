<template>
  <v-container fluid class="mt-n10">
    <v-row>
      <v-col :cols="isTabletAndMobile ? 12 : 8">
        <movie-list
          :movies="movies"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @update:currentPage="currentPage = $event"
        />
      </v-col>
      <v-col :cols="isTabletAndMobile ? 12 : 4">
        <filter-movie type="movie" @filter="updateFilter" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import axios from 'axios';
import useSWRV from 'swrv';
import MovieList from '@/components/MovieList.vue';
import FilterMovie from '@/components/FilterMovie.vue';

const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const filterParams = ref({});

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    const { toast } = await import('vue3-toastify');
    toast.error('Movie list is currently unavailable!');
  }
};

const { data } = useSWRV(
  () => {
    const baseUrl = 'https://apii.online/ophim/danh-sach';
    const queryParams = new URLSearchParams({
      ...filterParams.value,
      page: currentPage.value,
    });
    return `${baseUrl}?${queryParams}`;
  },
  fetcher,
  {
    refreshInterval: 3600000,
    revalidateOnFocus: false,
    errorRetryCount: 1,
    errorRetryInterval: 2000,
  }
);

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1;
  },
  { immediate: true }
);

watch(currentPage, (newPage) => router.push({ query: { page: newPage } }));

watch(data, (newData) => {
  if (newData) {
    movies.value = newData.items;
    totalPages.value = newData.pagination.totalPages;
  }
});

const updateFilter = (params) => {
  filterParams.value = params;
  currentPage.value = 1;
};
</script>
