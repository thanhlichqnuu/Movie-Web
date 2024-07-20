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
const isListening = ref(false);
const isMicrophoneAllowed = ref(true); // Thêm biến để theo dõi trạng thái quyền microphone
const showPermissionPrompt = ref(false); // Thêm biến để theo dõi trạng thái hiển thị thông báo xin quyền

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

let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    keyword.value = transcript;
    isListening.value = false;
  };

  recognition.onerror = (event) => {
    console.error(event);
    if (event.error === 'not-allowed') {
      isMicrophoneAllowed.value = false;
    }
    isListening.value = false;
  };

  recognition.onend = () => {
    isListening.value = false;
  };
}

const requestMicrophonePermission = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        isMicrophoneAllowed.value = true;
        showPermissionPrompt.value = false;
      })
      .catch((err) => {
        console.error(err);
        isMicrophoneAllowed.value = false;
        showPermissionPrompt.value = true;
      });
  
};

const startVoiceSearch = () => {
  if (recognition && !isListening.value) {
    if (isMicrophoneAllowed.value) {
      recognition.start();
    } else {
      showPermissionPrompt.value = true;
    }
  }
};

// Kiểm tra quyền microphone lần đầu
if (!navigator.permissions) {
  requestMicrophonePermission();
} else {
  navigator.permissions.query({ name: 'microphone' }).then((result) => {
    if (result.state === 'granted') {
      isMicrophoneAllowed.value = true;
    } else if (result.state === 'prompt') {
      requestMicrophonePermission();
    } else {
      isMicrophoneAllowed.value = false;
      showPermissionPrompt.value = true;
    }
  });
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
        <v-btn icon @click="startVoiceSearch">
          <v-icon v-if="isListening">mdi-microphone-off</v-icon>
          <v-icon v-else>mdi-microphone</v-icon>
        </v-btn>
      </template>
    </v-text-field>
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
    <div v-if="!isMicrophoneAllowed" class="alert alert-danger mt-3">
      Microphone access is denied or not supported in this browser. Please allow microphone access or use a supported browser to use voice search.
    </div>
    <div v-if="showPermissionPrompt" class="alert alert-info mt-3">
      This application needs microphone access to perform voice search. Please allow microphone access.
      <v-btn color="primary" @click="requestMicrophonePermission">Grant Access</v-btn>
    </div>
  </div>
</template>
<style scoped>
.max-h-400 {
  max-height: 400px;
  overflow-y: auto;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 10px;
  border-radius: 4px;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
  padding: 10px;
  border-radius: 4px;
}

.alert-info v-btn {
  margin-top: 10px;
}
</style>
