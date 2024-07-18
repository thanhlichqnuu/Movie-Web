<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import useSWRV from "swrv";

const { t } = useI18n();
const movieLabel = computed(() => t("singleMovie"));
const seriesLabel = computed(() => t("seriesMovie"));
const themeStore = useStateThemeStore();

const tabs = ref([
  {
    name: "Anime",
    api: "https://apii.online/apii/danh-sach?type=hoathinh&page=1",
    isActive: true
  },
  {
    name: movieLabel,
    api: "https://apii.online/apii/danh-sach?type=single&page=1",
  },
  {
    name: seriesLabel,
    api: "https://apii.online/apii/danh-sach?type=series&page=1",
  },
  {
    name: "TV Show",
    api: "https://apii.online/apii/danh-sach?type=tvshows&page=1",
  },
]);

const router = useRouter();
const currentTab = ref("");
const movies = ref([]);

const fetcher = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const { data } = useSWRV(
  () => tabs.value.find((tab) => tab.name === currentTab.value).api,
  fetcher,
  {
    refreshInterval: 3600000,
    revalidateOnFocus: false,
    revalidateDebounce: 500,
    errorRetryCount: 1,
    errorRetryInterval: 2000
  }
);

watch(data, (newData) => {
  if (newData) {
    movies.value = newData.items.slice(0, 5);
  }
});

const changeTab = async (tab) => {
  currentTab.value = tab.name;
  tabs.value.forEach((t) => (t.isActive = t.name === tab.name));
};

const navigateToDetail = (slug) => {
  router.push({ name: "Detail", params: { slugMovie: slug } });
};

onMounted(() => {
  currentTab.value = tabs.value[0].name;
});
</script>

<template>
  <v-main style="margin-top: -6px">
    <div>
      <h3 class="d-flex justify-start animate-charcter">
        {{ $t("lastUpdateLabel") }}
      </h3>
      <div class="line" />
    </div>

    <v-tabs v-model="currentTab">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        @click="changeTab(tab)"
      >
        {{ tab.name }}
        <div
          v-show="tab.isActive"
          :class="
            themeStore.isDark ? 'tab-indicator-white' : 'tab-indicator-black'
          "
        />
      </v-tab>
    </v-tabs>

    <div>
      <v-card
        v-for="movie in movies"
        :key="movie._id"
        @click="navigateToDetail(movie.slug)"
        class="mb-3"
      >
        <div class="d-flex">
          <v-img
            :src="`https://apii.online/image/${movie.thumb_url}`"
            loading="lazy"
            style="width: 65px; height: auto"
          ></v-img>
          <v-list-item class="mt-n5 w-100">
            <div class="d-flex">
              <v-card-title class="text-subtitle-2">{{
                movie.name
              }}</v-card-title>
            </div>
            <v-badge color="red" class="ml-7 mb-2">
              <template v-slot:badge>
                <span>{{ movie.year }}</span>
              </template>
            </v-badge>
            <v-badge color="blue" class="ml-12 mb-2">
              <template v-slot:badge>
                <span
                  >{{ movie.episode_current }}</span
                >
              </template>
            </v-badge>
            <v-badge color="green" class="mb-2" style="margin-left: 71px">
              <template v-slot:badge>
                <span>{{ movie }}</span>
              </template>
            </v-badge>
          </v-list-item>
        </div>
      </v-card>
    </div>
  </v-main>
</template>

<style scoped>
.tab-indicator-white {
  height: 3px;
  background-color: white;
  width: 100%;
  position: absolute;
  bottom: 0;
}

.tab-indicator-black {
  height: 3px;
  background-color: black;
  width: 100%;
  position: absolute;
  bottom: 0;
}

.animate-charcter {
  background-image: linear-gradient(
    -225deg,
    #231557 0%,
    #44107a 29%,
    #ff1361 67%,
    #fff800 100%
  );
  background-clip: border-box;
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 2s linear infinite;
  display: inline-block;
  font-size: 18px;
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}

.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
