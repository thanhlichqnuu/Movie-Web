<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import axios from "axios";
import { toast } from "vue3-toastify";

import { get, set } from "idb-keyval";
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

const getMovies = async (page) => {
  try {
    const cacheKey = `all_tv_page_${page}`;
    const cachedMovies = await get(cacheKey);
    if (cachedMovies) {
      movies.value = cachedMovies.items;
      totalPages.value = cachedMovies.pagination.totalPages;
    } else {
      const { data } = await axios.get(
        `https://ophim1.com/v1/api/danh-sach/tv-shows?page=${page}`
      );
      movies.value = data.data.items;
      totalPages.value = Math.ceil(
        data.data.params.pagination.totalItems /
          data.data.params.pagination.totalItemsPerPage
      );
      set(cacheKey, {
        items: data.data.items,
        pagination: { totalPages: totalPages.value },
      });
    }
  } catch {
    toast.error("TV Show list is currently unavailable!");
  }
};

const prefetchNextPage = async (page) => {
  if (page < totalPages.value) {
    const cachedMovies = await get(`all_tv_page_${page + 1}`);
    if (!cachedMovies) {
      await getMovies(page + 1);
    }
  }
};

watch(
  () => route.query.page,
  async (newPage) => {
    currentPage.value = Number(newPage) || 1;
    await getMovies(currentPage.value);
    prefetchNextPage(currentPage.value);
    
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
      <v-col :cols="isTabletAndMobile ? 12 : 8">
        <movie-list
          :movies="movies"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @update:currentPage="currentPage = $event"
        />
      </v-col>

      <v-col cols="4" v-if="!isTabletAndMobile">
        <newly-movies />
        <facebook-comments class="mt-4" href="https://motphimmoi.com" />
      </v-col>
    </v-row>
  </v-container>
</template>
