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
  } else {
    console.error('getUserMedia is not supported in this browser');
    isMicrophoneAllowed.value = false;
    showPermissionPrompt.value = true;
  }
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
