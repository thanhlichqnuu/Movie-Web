<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useWindowSize } from "@vueuse/core";
import { useFacebookStore } from "@/stores/useFacebookStore";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

const player = ref(null);
const videoPlayer = ref(null);
const movie = ref(null);
const episodes = ref([]);
const route = useRoute();
const router = useRouter();
const facebookStore = useFacebookStore();

const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 960);

const getMoviePlay = async (slugMovie) => {
  try {
    const { data } = await axios.get(`https://ophim1.com/phim/${slugMovie}`);
    movie.value = data;
    episodes.value = data.episodes[0].server_data;
    setupPlayer();
  } catch {
    toast.error("Không thể tải dữ liệu!");
  }
};

const currentEpisode = computed(
  () =>
    episodes.value.find(
      (episode) => episode.slug === route.params.slugEpisode
    ) || episodes.value[0]
);

const selectEpisode = async (episode) => {
  const slugEpisode = /^\d+$/.test(episode.slug) ? `tap-${episode.slug}` : episode.slug;
  router.push({
    name: "player-route",
    params: { slugMovie: route.params.slugMovie, slugEpisode },
  });
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setupPlayer();
};

const setupPlayer = async () => {
  if (!currentEpisode.value || !currentEpisode.value.link_m3u8) {
    return;
  }

  if (player.value) {
    player.value.destroy();
  }

  player.value = new Artplayer({
    container: videoPlayer.value,
    url: currentEpisode.value.link_m3u8,
    type: "m3u8",
    autoplay: false,
    fullscreen: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    pip: true,
    plugins: [
      artplayerPluginHlsQuality({
        control: true,
        getResolution: (level) => level.height + "P",
        title: "Quality",
        auto: "Auto",
      }),
    ],
    customType: {
      m3u8: function playM3u8(video, url, art) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy();
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          art.hls = hls;
          art.on("destroy", () => hls.destroy());
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else {
          art.notice.show = "Unsupported playback format: m3u8";
        }
      },
    },
  });
};

watch(
  currentEpisode,
  (newEpisode) => {
    if (newEpisode?.name) {
      if (newEpisode.slug.includes("tap")) {
        document.title = `${movie.value.movie.name} - ${newEpisode.name}`;
      }
      else {
        document.title = `${movie.value.movie.name} - Tập ${newEpisode.name}`;
      }
    }
  },
  { immediate: true }
);

watch(currentEpisode, setupPlayer);

onMounted(() => {
  getMoviePlay(route.params.slugMovie);
  facebookStore.initFacebookComments();
});

</script>
