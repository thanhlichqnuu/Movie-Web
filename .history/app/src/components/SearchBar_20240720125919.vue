<script setup>
import { ref, computed } from "vue";
import { watchThrottled } from "@vueuse/core";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["closeSearchModal"]);
const { t } = useI18n();

const router = useRouter();
const keyword = ref("");
const searchSuggestion = ref([]);
const isLoading = ref(false);
const isListening = ref(false)

const handleSearch = async (keyword) => {
  if (!keyword) {
    searchSuggestion.value = [];
    return;
  }
  try {
    isLoading.value = true;
    const { data } = await axios.get(
      `https://apii.online/apii/danh-sach?page=1&limit=7&search=${keyword}`
    );
    searchSuggestion.value = data.items;
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};

watchThrottled(
  keyword,
  (newKeyword) => {
    handleSearch(newKeyword);
  },
  { throttle: 300 }
);

const navigateToDetail = (slug) => {
  router.push({ name: "Detail", params: { slugMovie: slug } });
  emit("closeSearchModal");
};

const translateLabel = computed(() => t("keyword"));

const startVoiceSearch = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onresult = (e) => {
    const speechResult = e.results[0][0].transcript;
    keyword.value = speechResult;
    isListening.value = false;
  };

  recognition.onspeechend = () => {
    recognition.stop();
    isListening.value = false;
  };

  recognition.onerror = async (event) => {
    console.error("Speech recognition error detected: " + event.error);
    isListening.value = false;
    const { toast } = await import("vue3-toastify");
    toast.error("Movie detail not found!");
  };

  recognition.start();
};
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
    ><template v-slot:append>
        <v-btn icon @click="startVoiceSearch">
          <v-icon>mdi-microphone-off</v-icon>
          <v-icon v-if="isListening">mdi-microphone-off</v-icon>
        </v-btn>
      </template></v-text-field>
    <v-list v-if="searchSuggestion?.length" class="mt-4 rounded max-h-400">
      <v-list-item
        v-for="movie in searchSuggestion"
        :key="movie._id"
        @click="navigateToDetail(movie.slug)"
      >
        <v-avatar
          rounded="0"
          :image="`https://apii.online/image/${movie.thumb_url}`"
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
.is-listening .v-text-field__append-outer-icon {
  color: red;
}
</style>
