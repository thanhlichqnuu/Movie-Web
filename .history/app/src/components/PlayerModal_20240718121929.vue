<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useWindowSize } from "@vueuse/core";
import Artplayer from "artplayer";
import Hls from "hls.js";
import skipBackwardSvg from "@/assets/skip_backward.svg";
import skipForwardSvg from "@/assets/skip_forward.svg";

const player = ref(null);
const videoPlayer = ref(null);
const movie = ref(null);
const episodes = ref([]);
const route = useRoute();
const router = useRouter();
const serverNames = ref([]);
const serverName = ref(null);

const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);

const getMoviePlay = async (slugMovie) => {
  try {
    const { data } = await axios.get(
      `https://apii.online/apii/phim/${slugMovie}`
    );
    movie.value = data;
    episodes.value = data.episodes[0].server_data;
    serverNames.value = data.episodes.map((episode) => episode.server_name);
    serverName.value = data.episodes[0].server_name;
  } catch {
    const { toast } = await import("vue3-toastify");
    toast.error("Episode is currently unavailable!");
  }
};

const currentEpisode = computed(
  () =>
    episodes.value.find(
      (episode) => episode.slug === route.params.slugEpisode
    ) || episodes.value[0]
);

const changeServer = (server) => {
  const selectedServer = movie.value.episodes.find(
    (episode) => episode.server_name === server
  );
  if (selectedServer) {
    episodes.value = selectedServer.server_data;
    serverName.value = selectedServer.server_name;
    selectEpisode(currentEpisode.value)
    updateMetaTitle(currentEpisode.value);
    
  }
};

const selectEpisode = async (episode) => {
  await router.push({
    name: "Player",
    params: { slugEpisode: episode.slug },
  });
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setupPlayer();
};

const setupPlayer = async () => {
  if (!currentEpisode.value || !currentEpisode.value.link_m3u8) return;

  if (player.value) {
    player.value.destroy();
  }

  const isMobile = /iPhone|iPad|Android|Windows Phone|BlackBerry/i.test(
    navigator.userAgent
  );

  player.value = new Artplayer({
    container: videoPlayer.value,
    id: currentEpisode.value.link_m3u8,
    url: currentEpisode.value.link_m3u8,
    type: "m3u8",
    poster: "https://i.postimg.cc/7ZWhD60s/poster-artplayer.jpg",
    volume: 1,
    autoPlayback: true,
    setting: true,
    playbackRate: true,
    aspectRatio: true,
    pip: !isMobile,
    fullscreenWeb: !isMobile,
    fullscreen: true,
    controls: [
      {
        position: "right",
        html: `<img src="${skipBackwardSvg}" alt="Backward" style="width: 25px; height: 25px;">`,
        click: () => (player.value.currentTime -= 5),
      },
      {
        position: "right",
        html: `<img src="${skipForwardSvg}" alt="Forward" style="width: 25px; height: 25px;">`,
        click: () => (player.value.currentTime += 5),
      },
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

const updateMetaTitle = (newEpisode) => {
  if (newEpisode?.name) {
    document.title = newEpisode.name.includes("Tập")
      ? `${newEpisode.name} - ${movie.value.movie.name}`
      : `Tập ${newEpisode.name} - ${movie.value.movie.name}`;
  }
};

watch(
  currentEpisode,
  (newEpisode) => {
    updateMetaTitle(newEpisode);
  },
  { immediate: true }
);

watch(currentEpisode, setupPlayer);

onMounted(() => {
  getMoviePlay(route.params.slugMovie);
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
      <v-col :cols="isSmallTabletAndMobile ? 12 : 7" class="mt-10">
        <div class="mb-3">
          <v-btn
            v-for="(server, index) in serverNames"
            :key="index"
            @click="changeServer(server)"
            :color="server === serverName ? 'error' : 'default'"
            class="mx-1 my-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="14"
              fill="currentColor"
              class="bi bi-server"
              viewBox="0 0 16 16"
            >
              <path
                d="M1.333 2.667C1.333 1.194 4.318 0 8 0s6.667 1.194 6.667 2.667V4c0 1.473-2.985 2.667-6.667 2.667S1.333 5.473 1.333 4z"
              />
              <path
                d="M1.333 6.334v3C1.333 10.805 4.318 12 8 12s6.667-1.194 6.667-2.667V6.334a6.5 6.5 0 0 1-1.458.79C11.81 7.684 9.967 8 8 8s-3.809-.317-5.208-.876a6.5 6.5 0 0 1-1.458-.79z"
              />
              <path
                d="M14.667 11.668a6.5 6.5 0 0 1-1.458.789c-1.4.56-3.242.876-5.21.876-1.966 0-3.809-.316-5.208-.876a6.5 6.5 0 0 1-1.458-.79v1.666C1.333 14.806 4.318 16 8 16s6.667-1.194 6.667-2.667z"
              />
            </svg>
            {{ server }}
          </v-btn>
        </div>

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
        <slot name="newlymovies"></slot>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <slot name="fbdiv"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.loadingAnimation {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
