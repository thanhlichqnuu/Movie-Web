<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHead } from "@unhead/vue";
import { useFacebookStore } from "@/stores/useFacebookStore";
import { get, set } from "idb-keyval";

const route = useRoute();
const router = useRouter();
const facebookStore = useFacebookStore();
const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 640);
const currentYear = new Date().getFullYear();

const currentPage = ref(Number(route.query.page) || 1);
const movies = ref([]);
const totalPages = ref(1);

const updateMetaTitle = () => {
  useHead({
    title: `Danh Sách Phim Lẻ Đầy Đủ Nhất | Tổng Hợp Những Phim Lẻ Hay | Phim Lẻ Mới Nhất ${currentYear}`
  });
};

const getMovies = async (page) => {
  try {
    const cacheKey = `singles_page_${page}`;
    const cachedMovies = await get(cacheKey);
    if (cachedMovies) {
      movies.value = cachedMovies.items;
      totalPages.value = cachedMovies.pagination.totalPages;
    } else {
      const { data } = await axios.get(`https://apii.online/apii/danh-sach?type=single&page=${page}`);
      movies.value = data.items;
      totalPages.value = data.pagination.totalPages;
      set(cacheKey, { items: data.items, pagination: { totalPages: totalPages.value } });
    }
  } catch {
    toast.error("Không thể tải danh sách phim!");
  }
  finally {
    updateMetaTitle();
  }
  
};

const prefetchNextPage = async (page) => {
  if (page < totalPages.value) {
    const nextPage = page + 1;
    const cacheKey = `singles_page_${nextPage}`;
    const cachedMovies = await get(cacheKey);
    if (!cachedMovies) {
      getMovies(nextPage);
    }
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage) || 1;
    currentPage.value = page;
    getMovies(page);
    prefetchNextPage(page);
  },
  { immediate: true }
);

watch(currentPage, (newPage) => {
  router.push({ query: { page: newPage } });
});

getMovies(currentPage.value);
onMounted(facebookStore.initFacebookComments);
prefetchNextPage(currentPage.value);
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col :cols="isMobile ? 12 : 9">
        <v-row class="d-flex justify-start align-center" v-show="movies.length">
          <v-col :cols="isMobile ? 6 : 12" :md="isMobile ? null : 3" :sm="isMobile ? null : 4" v-for="movie in movies" :key="movie._id">
            <v-card @click="router.push({ name: 'detail-route', params: { slugMovie: movie.slug } })" class="movie_card">
              <v-img max-height="250" :src="`https://apii.online/image/${movie.thumb_url}`" :lazy-src="`https://apii.online/image/${movie.thumb_url}`" />
              <v-card-title class="text-subtitle-1 text-center">{{ movie.name }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-chip label small color="red-darken-1" class="mr-1">{{ movie.year }}</v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-badge
                color="red"
                class="episode-badge"
                :content="movie.episode_current"
              ></v-badge>
              <v-badge
                color="yellow"
                class="rating-badge"
                :content="movie.imdb_rating"
              >
             </v-badge>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-show="!movies.length">
          <v-progress-circular class="loadingAnimation" color="primary" indeterminate />
        </v-row>
        <v-pagination v-model="currentPage" :length="totalPages" />
      </v-col>

      <v-col :cols="isMobile ? 12 : 3">
        <v-card>
          <v-card-title>Bảng xếp hạng phim</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(rankedMovie, index) in rankedMovies" :key="index">
                <v-list-item-content>{{ rankedMovie.name }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-5">
      <div class="fb-comments" data-href="https://motphimmoi.com" data-width="100%" data-numposts="5"></div>
    </v-row>
  </v-container>
</template>
<style scoped>
.movie_card {
  width: 90%;
  position: relative;
}

.episode-badge {
  position: absolute;
  top: 10px;
  border-radius: 50%;
  padding: 10px;
  color: white;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 50%;
  padding: 10px;
  color: white;
}
</style>

