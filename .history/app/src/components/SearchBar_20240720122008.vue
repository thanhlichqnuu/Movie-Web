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

const startVoiceSearch = () => {
  if (recognition && !isListening.value) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        recognition.start();
        isMicrophoneAllowed.value = true;
      })
      .catch((err) => {
        console.error(err);
        isMicrophoneAllowed.value = false;
      });
  }
};
</script>
