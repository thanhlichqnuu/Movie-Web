<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
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

const cachedPages = ref(new Map());

const getMovies = async (page) => {
  try {
    if (cachedPages.value.has(page)) {
      const cachedData = cachedPages.value.get(page);
      movies.value = cachedData.items;
      totalPages.value = cachedData.totalPages;
    } else {
      const { data } = await axios.get(
        `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`
      );
      movies.value = data.items;
      totalPages.value = data.pagination.totalPages;
      cachedPages.value.set(page, {
        items: data.items,
        totalPages: data.pagination.totalPages,
      });
    }
  } catch {
    toast.error("Movie list is currently unavailable!");
  }
};

const prefetchNextPage = async (page) => {
  if (page < totalPages.value && !cachedPages.value.has(page + 1)) {
    await getMovies(page + 1);
  }
};

watch(
  () => route.query.page,
  async (newPage) => {
    currentPage.value = Number(newPage) || 1;
    await getMovies(currentPage.value);
    prefetchNextPage(currentPage.value);
    await nextTick();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
