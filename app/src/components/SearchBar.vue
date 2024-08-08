<script setup>
import { ref, computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "petite-vue-i18n";
import startSoundSrc from "../assets/audio/start-record_effect.mp3";
import endSoundSrc from "../assets/audio/end-record_effect.mp3";
import endSpeechSoundSrc from "../assets/audio/result-record_effect.mp3";
import sr from "@/util/speechRecognition";

const emit = defineEmits(["closeSearchModal"]);
const { t } = useI18n();

const router = useRouter();
const keyword = ref("");
const searchSuggestion = ref([]);
const isLoading = ref(false);
const isRecording = ref(false);
const isListening = ref(false);

const startSound = new Audio(startSoundSrc);
const endSound = new Audio(endSoundSrc);
const endSpeechSound = new Audio(endSpeechSoundSrc);

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

const handleSearchDebounce = useDebounceFn(handleSearch, 300);

watch(keyword, (newKeyword) => {
  handleSearchDebounce(newKeyword);
});

const navigateToDetail = (slug) => {
  router.push({ name: "Detail", params: { slugMovie: slug } });
  emit("closeSearchModal");
};

const defaultLabel = computed(() => t("keyword"));
const listeningLabel = computed(() => t("listening"));

const handleVoiceSearch = async () => {
  sr.lang = "vi-VN";
  sr.continuous = false;
  sr.interimResults = true;

  sr.onstart = () => {
    isRecording.value = true;
    isListening.value = true;
    startSound.play();
  };

  sr.onresult = (e) => {
    let transcript = e.results[0][0].transcript.toLowerCase();
    if (transcript.endsWith(".") || transcript.endsWith("?")) {
      transcript = transcript.slice(0, -1);
    }
    keyword.value = transcript;
    isListening.value = false;
  };

  sr.onspeechend = () => {
    endSpeechSound.play();
  };

  sr.onend = () => {
    isRecording.value = false;
    endSound.play();
    isListening.value = false;
  };

  sr.onerror = async (e) => {
    if (e.error === "not-allowed") {
      const { toast } = await import("vue3-toastify");
      toast.error("Microphone access denied!");
    }
  };

  sr.start();
};

const toggleMic = () => {
  if (isRecording.value) {
    sr.stop();
  } else {
    handleVoiceSearch();
  }
};
</script>

<template>
  <div>
    <v-text-field
      v-model="keyword"
      :loading="isLoading"
      append-inner-icon="mdi-magnify"
      density="compact"
      :label="isListening ? listeningLabel : defaultLabel"
      variant="solo"
      hide-details
      single-line
    >
      <template v-slot:append>
        <v-btn icon @click="toggleMic">
          <v-icon color="red" v-if="isRecording">mdi-microphone</v-icon>
          <v-icon v-else>mdi-microphone</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <v-list
      v-if="searchSuggestion?.length || isListening"
      class="mt-4 rounded max-h-400"
    >
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
</style>
