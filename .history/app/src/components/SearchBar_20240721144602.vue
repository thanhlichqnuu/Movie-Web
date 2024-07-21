<script setup>
import { ref, computed } from "vue";
import { watchThrottled } from "@vueuse/core";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";
import startSoundSrc from '../assets/start-record_effect.mp3';
import endSoundSrc from '../assets/end-record_effect.mp3';
import endSpeechSoundSrc from '../assets/result-record_effect.mp3';
import sr from "@/util/speechRecognition";

const emit = defineEmits(["closeSearchModal"]);
const { t } = useI18n();

const router = useRouter();
const keyword = ref("");
const searchSuggestion = ref([]);
const isLoading = ref(false);
const isRecording = ref(false)

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
  } catch {
    return;
  } finally {
    isLoading.value = false;
  }
};

watchThrottled(
  keyword,
  (newKeyword) => {
    handleSearch(newKeyword);
  },
  { throttle: 500 }
);

const navigateToDetail = (slug) => {
  router.push({ name: "Detail", params: { slugMovie: slug } });
  emit("closeSearchModal");
};

const translateLabel = computed(() => t("keyword"));

const handleVoiceSearch = () => {
  sr.lang = 'vi-VN';
  sr.continuous = false;
  sr.interimResults = true;

  sr.onstart = () => {
    isRecording.value = true;
    startSound.play()
  };

  sr.onresult = (e) => {
    let transcript = e.results[0][0].transcript.toLowerCase();
    if (transcript.endsWith(".") || transcript.endsWith("?")) {
      transcript = transcript.slice(0, -1);
    }
    keyword.value = transcript;
  };

  sr.onspeechend = () => {
    endSpeechSound.play()
  }

  sr.onend = () => {
    isRecording.value = false;
    endSound.play()
  };

  sr.onerror = async (e) => {
    if (e.error === 'not-allowed') {
      const { toast } = await import("vue3-toastify");
      toast.error("Microphone access denied!");
    }
  };

  sr.start()
}

const toggleMic = () => {
	if (isRecording.value) {
		sr.stop()
	} else {
		handleVoiceSearch()
	}
}
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
    >
    <template v-slot:append>
        <v-btn icon @click="toggleMic">
          <v-icon color="red" v-if="isRecording">mdi-microphone</v-icon>
          <v-icon v-else>mdi-microphone</v-icon>
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
</style>