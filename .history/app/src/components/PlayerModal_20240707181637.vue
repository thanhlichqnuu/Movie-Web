<script setup>
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
    poster: 'https://i.postimg.cc/7ZWhD60s/poster-artplayer.jpg',
    volume: 1,
    screenshot: true,
    url: currentEpisode.value.link_m3u8,
    type: "m3u8",
    fullscreenWeb: true,
    fullscreen: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    pip: true,
icons: {
        state: '<img src="">',
    },
    cssVar: {
      "opacity: 3000
}
    },
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

  const videoElement = player.value.template.$video;

  videoElement.addEventListener('dblclick', (event) => {
    const rect = videoElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPositionRatio = clickX / rect.width;

    const wasPlaying = !videoElement.pause;  // Check if the video is playing

    if (clickPositionRatio < 0.5) {
      // Double click on the left half of the video
      videoElement.currentTime = Math.max(0, videoElement.currentTime - 10); // Rewind 10 seconds
    } else {
      // Double click on the right half of the video
      videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 10); // Fast forward 10 seconds
    }

    if (wasPlaying) {
      videoElement.play();  // Continue playing if it was playing before
    }
  });
};

watch(
  currentEpisode,
  (newEpisode) => {
    if (newEpisode?.name) {
      if (newEpisode.slug.includes("tap")) {
        document.title = `${newEpisode.name} - ${movie.value.movie.name}`;
      }
      else {
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
          <div
            ref="videoPlayer"
            style="width: 100%; height: 75vh"
          ></div>
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
    <v-container v-show="isSmallTabletAndMobile">
      <v-row>
        <v-col cols="12" class="mt-10 mr-6">
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
      </v-row>
    </v-container>
    <v-container v-show="!isSmallTabletAndMobile">
      <v-row>
        <v-col cols="8" class="mt-10">
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
      </v-row>
    </v-container>

    <v-row class="mt-5">
      <div
        class="fb-comments"
        :data-href="`https://motphimmoi.com/phim/${route.params.slugMovie}`"
        data-width="100%"
        data-numposts="5"
      ></div>
    </v-row>
  </v-container>
</template>
