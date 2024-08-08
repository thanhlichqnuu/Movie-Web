<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import axios from "axios";
import useSWRV from "swrv";
import MovieList from "@/components/MovieList.vue";

const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);
const isLoading = ref(false);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const fetcher = async (url) => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    const { toast } = await import("vue3-toastify");
    toast.error("Movie list is currently unavailable!");
  } finally {
    isLoading.value = false;
  }
};

const { data } = useSWRV(
  () =>
    `https://apii.online/apii/danh-sach/phim-moi-cap-nhat?page=${currentPage.value}`,
  fetcher,
  {
    refreshInterval: 3600000,
    revalidateOnFocus: false,
  }
);

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1;
  },
  { immediate: true }
);

watch(currentPage, async (newPage) => {
  await router.push({ query: { page: newPage } });
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
        <v-row v-if="isLoading" class="mt-9 d-flex justify-start align-center">
          <v-col
            :cols="isTabletAndMobile ? 6 : 12"
            :md="isTabletAndMobile ? null : 3"
            :sm="isTabletAndMobile ? null : 4"
            v-for="n in 24"
          >
            <v-skeleton-loader
              elevation="2"
              max-width="100%"
              type="image, heading, subtitle"
            >
            </v-skeleton-loader>
          </v-col>
        </v-row>
        <movie-list
          v-else
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
