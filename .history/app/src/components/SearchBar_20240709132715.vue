<script setup>
import { ref, computed } from "vue";
import { watchThrottled } from "@vueuse/core";
import { useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
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
<v-container>

</v-container>
    
 
</template>

<style scoped>
.max-h-400 {
  max-height: 400px;
  overflow-y: auto;
}
</style>
