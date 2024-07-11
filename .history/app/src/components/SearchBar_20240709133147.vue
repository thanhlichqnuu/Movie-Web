<script setup>
import { ref, computed } from "vue";
import { watchThrottled } from "@vueuse/core";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["close-modal"]);
const { t } = useI18n();

const router = useRouter();
const keyword = ref("");
const searchSuggestion = ref([]);
const isLoading = ref(false);

const handleSearch = async (keyword) => {
  if (!keyword) {
    searchSuggestion.value = [];
    return;
  }
try {
  
}
  isLoading.value = true;
  const { data } = await axios.get(
    `https://ophim1.com/v1/api/tim-kiem?keyword=${keyword}`
  );
  searchSuggestion.value = data.data.items;
  isLoading.value = false;
};

watchThrottled(
  keyword,
  (newKeyword) => {
    handleSearch(newKeyword);
  },
  { throttle: 500 }
);

const navigateToDetail = (slugMovie) => {
  router.push({ name: "Detail", params: { slugMovie } });
  emit("close-modal");
};

const translateLabel = computed(() => t("keyword"));
</script>

<template>
  <div>
    <v-text-field
      v-model="keyword"
      :loading="isLoading"
      append-inner-icon="mdi-magnify"
      density="compact"
      :label="translateLabel"
      variant="solo"
      hide-details
      single-line
    ></v-text-field>
    <v-list v-if="searchSuggestion.length" class="mt-4 rounded max-h-400">
      <v-list-item
        v-for="movie in searchSuggestion"
        :key="movie._id"
        @click="navigateToDetail(movie.slug)"
      >
        <v-avatar
          rounded="0"
          :image="`https://img.ophim.live/uploads/movies/${movie.thumb_url}`"
          loading="lazy"
          max-width="50"
          max-height="50"
          class="mr-2"
        ></v-avatar>

        <span class="text-subtitle-2">{{ movie.name }}</span>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.max-h-400 {
  max-height: 400px;
  overflow-y: auto;
}
</style>
