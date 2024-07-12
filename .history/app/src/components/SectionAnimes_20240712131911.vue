<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import axios from "axios";
import useSWRV, { mutate } from 'swrv';
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
    const { toast } = await import('vue3-toastify');
    toast.error("Anime list is currently unavailable!");
  }
};

const { data } = useSWRV(
  () => `https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=${currentPage.value}`,
  fetcher,
  {
    refreshInterval: 3600000,
    revalidateOnFocus: false
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

    movies.value = data.data.items;
    totalPages.value = Math.ceil(
        data.data.params.pagination.totalItems /
          data.data.params.pagination.totalItemsPerPage
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
