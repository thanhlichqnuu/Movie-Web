<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFetch, useWindowSize } from "@vueuse/core";
import axios from "axios";
import useSWRV from 'swrv';
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
    // const { data } = await useFetch(url).get().json();
    return data;
  } catch {
    const { toast } = await import('vue3-toastify');
    toast.error("Movie list is currently unavailable!");
  }
};

const { data } = useSWRV(
  () => `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${currentPage.value}`,
  fetcher,
  {
    refreshInterval: 3600000,
    revalidateOnFocus: false,
    errorRetryCount: 1
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
}
);
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
        <slot name="sidebar"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>
