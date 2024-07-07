<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useWindowSize } from "@vueuse/core";
import TrailerModal from "../components/TrailerModal";
import { toast } from "vue3-toastify";
import sanitizeHtml from "sanitize-html";
import { useFacebookStore } from "@/stores/useFacebookStore";
import { get, set } from "idb-keyval";
import { useStateThemeStore } from "@/stores/useStateThemeStore";

const store = useStateThemeStore();
const route = useRoute();
const router = useRouter();
const facebookStore = useFacebookStore();
const movie = ref(null);
const isShowTrailer = ref(false);
const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);

const backgroundOpacity = computed(() => (store.isDark ? 0.8 : 0.5));

const getMovieDetail = async (slugMovie) => {
  const cacheKey = `movie_detail_${slugMovie}`;
  const cachedMovie = await get(cacheKey);
  if (cachedMovie) {
    movie.value = cachedMovie;
    return;
  }
  try {
    const { data } = await axios.get(`https://ophim1.com/phim/${slugMovie}`);
    data.movie.content = sanitizeHtml(data.movie.content, {
      allowedTags: [],
      allowedAttributes: {},
    });
    movie.value = data;
    set(cacheKey, data);
  } catch {
    toast.error("Movie detail not found!");
  }
};

watch(
  () => route.params.slugMovie,
  async (newSlugMovie) => {
    movie.value = null;
    await getMovieDetail(newSlugMovie);
    window.scrollTo({ top: 0, behavior: "instant" });
  },
  { immediate: true }
);

const trailerAvailable = computed(() => movie.value.movie.trailer_url);

const loadTrailer = () => (isShowTrailer.value = true);

const episodeAvailable = computed(
  () => movie.value.episodes[0].server_data[0].slug
);

const loadMovie = () => {
  router.push({
    name: "Player",
    params: {
      slugMovie: movie.value.movie.slug,
      slugEpisode: movie.value.episodes[0].server_data[0].slug,
    },
  });
};

watch(
  movie,
  (newMovie) => {
    if (newMovie?.movie.name && newMovie?.movie.origin_name) {
      document.title = `${newMovie.movie.name} - ${newMovie.movie.origin_name}`;
    }
  },
  { immediate: true }
);

onMounted(facebookStore.initFacebookComments);
</script>

<template>
  <v-container>
    <v-row>
    <v-card v-if="movie">
      
        <v-col cols="12" class="background-container d-flex">
          <v-img
            :src="movie.movie.poster_url"
            class="background"
            cover
            position="center"
            :style="{ opacity: backgroundOpacity }"
          />
          <template v-if="!isSmallTabletAndMobile">
            <v-col cols="6" sm="4" class="d-flex justify-center align-center">
              <v-img :src="movie.movie.thumb_url" height="70%" />
            </v-col>
            <v-col
              cols="6"
              sm="8"
              class="d-flex flex-column justify-space-between"
            >
              <div class="mt-11">
                <v-card-title class="text-green-light text-h5">{{
                  movie.movie.name
                }}</v-card-title>
                <v-card-title class="mt-n3" style="font-size: 16px">{{
                  movie.movie.origin_name
                }}</v-card-title>
                <v-card-text class="text-dim-gray">{{
                  movie.movie.content
                }}</v-card-text>
              </div>
              <v-card-action class="mb-15 ml-4">
                <v-btn
                  v-if="episodeAvailable"
                  color="light-blue-darken-1"
                  height="40"
                  @click="loadMovie"
                  class="mr-3"
                  >{{ $t("play") }}</v-btn
                >
                <v-btn
                  v-if="trailerAvailable"
                  color="red-darken-1"
                  height="40"
                  @click="loadTrailer"
                  >{{ $t("watchTrailer") }}</v-btn
                >
              </v-card-action>
            </v-col>
          </template>

          <template v-if="isSmallTabletAndMobile">
            <v-col cols="12" class="d-flex flex-column">
              <div>
                <div>
                  <v-card-title class="text-green-light text-h5">{{
                    movie.movie.name
                  }}</v-card-title>
                  <v-card-title class="text-subtitle-1 mt-n3">{{
                    movie.movie.origin_name
                  }}</v-card-title>
                </div>
                <v-img
                  :src="movie.movie.thumb_url"
                  height="300px"
                  class="mb-3"
                />
                <div>
                  <v-card-text class="text-dim-gray">{{
                    movie.movie.content
                  }}</v-card-text>
                  <v-card-action class="ml-4">
                    <v-btn
                      v-if="episodeAvailable"
                      color="light-blue-darken-1"
                      height="40"
                      @click="loadMovie"
                      class="mr-3"
                      >{{ $t("play") }}</v-btn
                    >
                    <v-btn
                      v-if="trailerAvailable"
                      color="red-darken-1"
                      height="40"
                      @click="loadTrailer"
                      >{{ $t("watchTrailer") }}</v-btn
                    >
                  </v-card-action>
                </div>
              </div>
            </v-col>
          </template>
          <TrailerModal
            :show="isShowTrailer"
            :url="movie.movie.trailer_url"
            @close="isShowTrailer = false"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-row
            :class="{
              'd-flex align-center flex-column': isSmallTabletAndMobile,
            }"
          >
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("status")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">{{
                      movie.movie.episode_current
                    }}</v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("episodes")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">{{
                      movie.movie.episode_total
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("time")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">{{
                      movie.movie.time
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("category")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">
                      <span
                        v-for="(category, index) in movie.movie.category"
                        :key="index"
                      >
                        {{ category.name
                        }}<span v-if="index < movie.movie.category.length - 1"
                          >,
                        </span>
                      </span>
                    </v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("director")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">
                      <span
                        v-for="(director, index) in movie.movie.director"
                        :key="index"
                      >
                        {{ director
                        }}<span v-if="index < movie.movie.director.length - 1"
                          >,
                        </span>
                      </span>
                    </v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("country")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">
                      <span
                        v-for="(country, index) in movie.movie.country"
                        :key="index"
                      >
                        {{ country.name
                        }}<span v-if="index < movie.movie.country.length - 1"
                          >,
                        </span>
                      </span>
                    </v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("quality")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">{{
                      movie.movie.quality
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("releaseYear")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">{{
                      movie.movie.year
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text-size">{{
                      $t("subtitle")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text-size">{{
                      movie.movie.lang
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
    <v-row v-if="!movie">
      <v-progress-circular
        class="loadingAnimation"
        color="primary"
        indeterminate
      />
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <div
          class="fb-comments"
          :data-href="`https://motphimmoi.com/phim/${route.params.slugMovie}`"
          data-width="100%"
          data-numposts="5"
        ></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text-green-light {
  color: #b5e745;
}

.text-dim-gray {
  color: #e0e0e0;
}

.background-container {
  position: relative;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.text-size {
  font-size: 14px;
}
</style>
