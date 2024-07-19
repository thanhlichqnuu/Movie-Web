<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import axios from "axios";
import useSWRV from "swrv";
import MovieList from "@/components/MovieList.vue";
import FilterMovie from "@/components/FilterMovie.vue";

const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const urls = () => {
  let url = `https://apii.online/apii/danh-sach?type=hoathinh&page=${currentPage.value}`;
  if (route.query.year) url += `&year=${route.query.year}`;
  if (route.query.status) url += `&status=${route.query.status}`;
  if (route.query.country) url += `&country=${route.query.country}`;
  if (route.query.category) url += `&category=${route.query.category}`;
  return url;
};

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    const { toast } = await import("vue3-toastify");
    toast.error("Anime list is currently unavailable!");
  }
};

const { data } = useSWRV(urls, fetcher, {
  refreshInterval: 3600000,
  revalidateOnFocus: false,
  errorRetryCount: 1,
  errorRetryInterval: 2000,
});

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1;
  },
  { immediate: true }
);

watch(currentPage, (newPage) => {
  const query = { page: newPage };
  if (route.query.year) query.year = route.query.year;
  if (route.query.status) query.status = route.query.status;
  if (route.query.country) query.country = route.query.country;
  if (route.query.category) query.category = route.query.category;
  router.push({ query });
  window.scrollTo({ top: 0, behavior: "smooth" }); 
});

watch(data, (newData) => {
  if (newData) {
    movies.value = newData.items;
    totalPages.value = newData.pagination.totalPages;
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
        <filter-movie v-if="!isTabletAndMobile" />
        <slot name="sidebar"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>
