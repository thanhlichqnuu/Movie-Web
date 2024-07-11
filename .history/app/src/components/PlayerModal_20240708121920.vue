<script setup>
import NewlyMovies from "@/components/NewlyMovies.vue";
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useWindowSize } from "@vueuse/core";
import { useFacebookStore } from "@/stores/useFacebookStore";
import Artplayer from "artplayer";
import Hls from "hls.js";

const player = ref(null);
const videoPlayer = ref(null);
const movie = ref(null);
const episodes = ref([]);
const serverName = ref(null);
const route = useRoute();
const router = useRouter();
const facebookStore = useFacebookStore();

const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);

const getMoviePlay = async (slugMovie) => {
  try {
    const { data } = await axios.get(`https://ophim1.com/phim/${slugMovie}`);
    movie.value = data;
    episodes.value = data.episodes[0].server_data;
    serverName.value = data.episodes[0].server_name;
  } catch {
    toast.error("Episode is currently unavailable!");
  }
};

const currentEpisode = computed(
  () =>
    episodes.value.find(
      (episode) => episode.slug === route.params.slugEpisode
    ) || episodes.value[0]
);

const selectEpisode = async (episode) => {
  router.push({
    name: "Player",
    params: { slugMovie: route.params.slugMovie, slugEpisode: episode.slug },
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
    id: currentEpisode.value.link_m3u8,
    autoPlayback: true,
    poster: "https://i.postimg.cc/7ZWhD60s/poster-artplayer.jpg",
    volume: 1,
    url: currentEpisode.value.link_m3u8,
    type: "m3u8",
    fullscreenWeb: true,
    fullscreen: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    pip: true,
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

  const isMobile =
    /iPhone|iPad|Android/i.test(navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches;

  if (isMobile) {
    const videoElement = player.value.template.$video;

    videoElement.addEventListener("dblclick", (event) => {
      const rect = videoElement.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickPositionRatio = clickX / rect.width;

      if (clickPositionRatio < 0.3) {
        videoElement.currentTime = Math.max(0, videoElement.currentTime - 5);
        videoElement.play();
      } else if (clickPositionRatio > 0.7) {
        videoElement.currentTime = Math.min(
          videoElement.duration,
          videoElement.currentTime + 5
        );
        videoElement.play();
      }
    });
  }
};

watch(
  currentEpisode,
  (newEpisode) => {
    if (newEpisode?.name) {
      if (newEpisode.slug.includes("tap")) {
        document.title = `${newEpisode.name} - ${movie.value.movie.name}`;
      } else {
        document.title = `Tập ${newEpisode.name} - ${movie.value.movie.name}`;
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

<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <div class="w-100">
          <div ref="videoPlayer" style="width: 100%; height: 75vh"></div>
          <div v-if="!currentEpisode">
            <v-progress-circular
              class="loadingAnimation"
              color="primary"
              indeterminate
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="isSmallTabletAndMobile ? 12 : 7" class="mt-12">
        <h4 color="red-accent-4" disabled v-if="serverName" class="ml-1 mb-1"
          ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
  <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"/>
</svg>
          {{ serverName }}
        </h4>
        <div class="d-flex justify-start flex-wrap">
          <v-btn
            v-for="(episode, index) in episodes"
            :key="index"
            @click="selectEpisode(episode)"
            :color="
              episode.slug === currentEpisode.slug ? 'primary' : 'default'
            "
            class="mx-1 my-1"
          >
            {{ episode.name }}
          </v-btn>
        </div>
      </v-col>
      <v-col :cols="isSmallTabletAndMobile ? 12 : 5">
        <newly-movies />
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <div
        class="fb-comments"
        :data-href="`https://motphimmoi.com/${route.params.slugMovie}`"
        data-width="100%"
        data-numposts="5"
      ></div>
    </v-row>
  </v-container>
</template>
