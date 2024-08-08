<script setup>
import { ref, computed, nextTick, onMounted, watch, onUnmounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useWindowSize } from "@vueuse/core";
import Artplayer from "artplayer";
import Hls from "hls.js";
import skipBackwardSvg from "@/assets/image/skip_backward.svg";
import skipForwardSvg from "@/assets/image/skip_forward.svg";

const player = ref(null);
const videoPlayer = ref(null);
const movie = ref(null);
const isLandscapeMobile = ref(false);

const isMobile = /iPhone|Android|Windows Phone|BlackBerry/i.test(
  navigator.userAgent
);
const episodes = ref([]);
const route = useRoute();
const router = useRouter();
const serverNames = ref([]);
const serverName = ref(null);
const isLightOff = ref(false);

const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);

const getMoviePlay = async (slugMovie) => {
  try {
    const { data } = await axios.get(
      `https://apii.online/apii/phim/${slugMovie}`
    );
    movie.value = data;
    const reversedEpisodes = data.episodes.reverse();
    episodes.value = reversedEpisodes[0].server_data;
    serverNames.value = reversedEpisodes.map((episode) => episode.server_name);
    serverName.value = reversedEpisodes[0].server_name;
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

const changeServer = async (server) => {
  const selectedServer = movie.value.episodes.find(
    (episode) => episode.server_name === server
  );

  if (selectedServer) {
    if (!selectedServer.server_data[0]?.slug) {
      const { toast } = await import("vue3-toastify");
      toast.warning("Server is currently maintenance!");
      return;
    }
    episodes.value = selectedServer.server_data;
    serverName.value = selectedServer.server_name;
    await selectEpisode(episodes.value[0]);
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

const formattedEpisodes = computed(() =>
  episodes.value.map((episode) => {
    return {
      ...episode,
      displayName: episode.name.includes("Tập")
        ? episode.name
        : `Tập ${episode.name}`,
    };
  })
);

const nextEpisode = async () => {
  const currentIndex = episodes.value.indexOf(currentEpisode.value);
  if (currentIndex >= 0 && currentIndex < episodes.value.length - 1) {
    await selectEpisode(episodes.value[currentIndex + 1]);
  } else {
    const { toast } = await import("vue3-toastify");
    toast.info("You're in the last episode!");
  }
};

const captureScreenshot = async () => {
  try {
    const videoElement = player.value?.video;
    if (!videoElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "screenshot.png";
    link.click();
  } catch {
    const { toast } = await import("vue3-toastify");
    toast.warning("Your browser does not support this feature!");
  }
};

const toggleLightsOff = () => {
  isLightOff.value = !isLightOff.value;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const setupPlayer = async () => {
  if (!currentEpisode.value || !currentEpisode.value.link_m3u8) return;

  if (player.value) {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
    player.value.destroy();
  }

  player.value = new Artplayer({
    container: videoPlayer.value,
    id: currentEpisode.value.link_m3u8,
    url: currentEpisode.value.link_m3u8,
    type: "m3u8",
    poster: "https://i.postimg.cc/mkhWGSXn/poster-artplayer-2.jpg",
    volume: 1,
    autoPlayback: true,
    setting: true,
    playbackRate: true,
    aspectRatio: true,
    pip: !isMobile,
    fullscreenWeb: !isMobile,
    fullscreen: true,
    lock: true,
    icons: {
      state: "",
    },
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

const handleOrientationChange = () => {
  const mediaQuery = window.matchMedia("(orientation: landscape)");
  isLandscapeMobile.value = isMobile && mediaQuery.matches;
};

onMounted(() => {
  getMoviePlay(route.params.slugMovie);
  window.scrollTo({ top: 0, behavior: "instant" });
  handleOrientationChange();
  window
    .matchMedia("(orientation: landscape)")
    .addEventListener("change", handleOrientationChange);
});

onBeforeUnmount(() => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  }

  if (player.value) {
    player.value.destroy();
  }
})

onUnmounted(() => {
  window
    .matchMedia("(orientation: landscape)")
    .removeEventListener("change", handleOrientationChange);
});
</script>

<template>
  <v-container class="mt-5">
    <v-row class="light-on-container" style="z-index: 1002;">
      <v-col cols="12" class="d-flex justify-center">
        <div class="w-100">
          <div
            ref="videoPlayer"
            :class="[
              isMobile ? 'video-player_mobile' : 'video-player_pc',
              isLandscapeMobile ? 'video-player_pc' : '',
            ]"
          ></div>
          <div v-if="!currentEpisode">
            <v-progress-circular
              class="animation_loading"
              color="primary"
              indeterminate
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="light-on-container mt-n2">
      <v-col class="d-flex ga-2 flex-wrap" cols="12">
        <v-btn @click="nextEpisode"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-skip-end-fill mr-1"
            viewBox="0 0 16 16"
          >
            <path
              d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z"
            /></svg
          >{{ $t("nextEpisode") }}</v-btn
        >
        <v-btn @click="captureScreenshot"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-camera-fill mr-1"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path
              d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"
            /></svg
          >{{ $t("capture") }}</v-btn
        >
        <v-btn @click="toggleLightsOff"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-lightbulb-fill mr-1"
            viewBox="0 0 16 16"
          >
            <path
              d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5"
            /></svg
          >{{ isLightOff ? $t("lightOn") : $t("lightOff") }}</v-btn
        >
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="isSmallTabletAndMobile ? 12 : 7" class="mt-2">
        <div class="mb-4">
          <v-banner bg-color="#d43939" :text="$t('note')"> </v-banner>
        </div>
        <div class="mb-3 d-flex flex-wrap">
          <v-btn
            v-for="(server, index) in serverNames"
            :key="index"
            @click="changeServer(server)"
            :color="server === serverName ? 'error' : 'default'"
            class="mx-1 my-1"
          >
            {{ server }}
          </v-btn>
        </div>

        <div class="d-flex justify-start flex-wrap">
          <v-btn
            v-for="(episode, index) in formattedEpisodes"
            :key="index"
            @click="selectEpisode(episode)"
            :color="
              episode.slug === currentEpisode.slug ? 'primary' : 'default'
            "
            class="mx-1 my-1"
          >
            {{ episode.displayName }}
          </v-btn>
        </div>
      </v-col>
      <v-col class="mt-n10" :cols="isSmallTabletAndMobile ? 12 : 5">
        <slot name="newlymovies"></slot>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <slot name="fbdiv"></slot>
      </v-col>
    </v-row>

    <div :class="[isLightOff ? 'dark-overlay' : 'dark-overlay-hidden']" />
  </v-container>
</template>

<style scoped>
.animation_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.video-player_mobile {
  width: 100%;
  height: 50vh;
}

.video-player_pc {
  width: 100%;
  height: 75vh;
}

.dark-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1000;
}

.dark-overlay-hidden {
  display: none;
}

.light-on-container {
  position: relative;
  z-index: 1001;
}
</style>
