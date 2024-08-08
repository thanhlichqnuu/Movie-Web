<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import axios from "axios";
import useSWRV from "swrv";
import MovieList from "@/components/MovieList.vue";
import FilterMovie from "@/components/FilterMovie.vue";
import { useI18n } from "petite-vue-i18n";
import { useFilterCriteria } from "@/util/filterCriteria";

const { statusMap, countryMap, categoryMap } = useFilterCriteria();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);
const isLoading = ref(false);

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const urls = computed(() => {
  const query = new URLSearchParams(route.query).toString();
  return `https://apii.online/apii/danh-sach?type=series&page=${currentPage.value}&${query}`;
});

const fetcher = async (url) => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    const { toast } = await import("vue3-toastify");
    toast.error("Series list is currently unavailable!");
  } finally {
    isLoading.value = false;
  }
};

const { data } = useSWRV(urls, fetcher, {
  refreshInterval: 3600000,
  revalidateOnFocus: false,
});

const listLabel = computed(() => t("list"));

const filterText = computed(() => {
  const filters = [];
  const { year, category, status, country } = route.query;
  if (year) filters.push(`${t("releaseYear")} ${year}`);
  if (category) filters.push(`${t("category")} ${categoryMap.value[category]}`);
  if (status) filters.push(`${t("status")} ${statusMap.value[status]}`);
  if (country) filters.push(`${t("country")} ${countryMap.value[country]}`);
  return filters.length
    ? `${listLabel.value} ${route.name} ${filters.join(", ")}`
    : "";
});

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1;
  },
  { immediate: true }
);

watch(currentPage, async (newPage) => {
  const query = { ...route.query, page: newPage };
  await router.push({ query });
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
        <span class="filter-text mt-14 mb-n2" v-if="filterText">{{
          filterText
        }}</span>
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
            ></v-skeleton-loader>
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
        <filter-movie v-if="!isTabletAndMobile" />
        <slot name="sidebar"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.filter-text {
  background-color: #b5e745;
  display: inline-block;
  color: #333;
  font-weight: 500;
  font-size: 17px;
}
</style>
