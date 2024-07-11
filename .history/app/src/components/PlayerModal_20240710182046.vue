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
  if (!currentEpisode.value) {
    return;
  }
    if (player.value) {
      player.value.destroy();
    }

    player.value = new Artplayer({
      container: videoPlayer.value,
      id: urlToUse,
      autoPlayback: true,
      poster: "https://i.postimg.cc/7ZWhD60s/poster-artplayer.jpg",
      volume: 1,
      url: urlToUse,
      type: 'm3u8',
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
  } 
  

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
          <div ref="videoPlayer" style="width: 100%; height: 75vh" />
            <!-- Render Artplayer or iframe based on the condition -->
            <div v-if="player"></div>
            <div v-else-if="currentEpisode && currentEpisode.link_embed">
              <iframe
              
                :src="currentEpisode.link_embed"
                width="100%"
                height="100%"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
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
        <div class="mb-1 ml-1">
          <h4 v-if="serverName" style="color: #A1AEB1;"
          ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="currentColor" class="bi bi-server" viewBox="0 0 16 16">
  <path d="M1.333 2.667C1.333 1.194 4.318 0 8 0s6.667 1.194 6.667 2.667V4c0 1.473-2.985 2.667-6.667 2.667S1.333 5.473 1.333 4z"/>
  <path d="M1.333 6.334v3C1.333 10.805 4.318 12 8 12s6.667-1.194 6.667-2.667V6.334a6.5 6.5 0 0 1-1.458.79C11.81 7.684 9.967 8 8 8s-3.809-.317-5.208-.876a6.5 6.5 0 0 1-1.458-.79z"/>
  <path d="M14.667 11.668a6.5 6.5 0 0 1-1.458.789c-1.4.56-3.242.876-5.21.876-1.966 0-3.809-.316-5.208-.876a6.5 6.5 0 0 1-1.458-.79v1.666C1.333 14.806 4.318 16 8 16s6.667-1.194 6.667-2.667z"/>
</svg>
          {{ serverName }}
        </h4>
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
