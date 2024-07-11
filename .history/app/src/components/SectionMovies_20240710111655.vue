<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import useSWRV, { cache, mutate } from 'swrv';
import axios from "axios";
import { toast } from "vue3-toastify";
import NewlyMovies from "@/components/NewlyMovies.vue";
import FacebookComments from "@/components/FacebookComments.vue";
import MovieList from "@/components/MovieList.vue";

const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    toast.error("Movie list is currently unavailable!");
  }
};

const { data } = useSWRV(
  () => `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${currentPage.value}`,
  fetcher,
  {
    refreshInterval: 14400000,
    ttl: 0,
  }
);

const prefetchNextPage = async (page) => {
  if (page < totalPages.value) {
    const nextPageUrl = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page + 1}`;
    try {
      const { data } = await axios.get(nextPageUrl);
      mutate(nextPageUrl, data);
    } catch (error) {
      console.error("Prefetch error: ", error);
      toast.error("Prefetch is currently unavailable!");
    }
  }
};

const checkCache = (page) => {
  const url = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
  const cachedData = cache.get(url);
  if (cachedData) {
    console.log(`Dữ liệu trong cache cho trang ${page}:`, cachedData);
  } else {
    console.log(`Không có dữ liệu trong cache cho trang ${page}`);
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1;
    checkCache(currentPage.value);
  },
  { immediate: true }
);

watch(currentPage, (newPage) => router.push({ query: { page: newPage } }));

watch(data, (newData) => {
  if (newData) {
    movies.value = newData.items;
    totalPages.value = newData.pagination.totalPages;
    prefetchNextPage(currentPage.value);
    checkCache(currentPage.value + 1);  // Kiểm tra cache cho trang kế tiếp
  }
});
</script>

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
        <newly-movies />
        <facebook-comments class="mt-4" href="https://motphimmoi.com" />
      </v-col>
    </v-row>
  </v-container>
</template>
