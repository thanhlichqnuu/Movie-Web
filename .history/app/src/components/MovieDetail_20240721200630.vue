<script setup>
import { ref, watch, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import useSWRV from "swrv";
import { useWindowSize } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const movie = ref(null);
const isShowTrailerModal = ref(false);
const { width: windowWidth } = useWindowSize();
const isSmallTabletAndMobile = computed(() => windowWidth.value < 768);
const reversedEpisodes = null;

const TrailerModal = defineAsyncComponent(() =>
  import("@/components/TrailerModal.vue")
);

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url);
    data.movie.content = data.movie.content.replace(
      /<\/?[^>]+(>|$)|&quot;|&#39;|&nbsp;/g,
      ""
    );
    return data;
  } catch {
    const { toast } = await import("vue3-toastify");
    toast.error("Movie detail not found!");
  }
};

const { data } = useSWRV(
  () => `https://apii.online/apii/phim/${route.params.slugMovie}`,
  fetcher,
  {
    refreshInterval: 3600000,
    revalidateOnFocus: false,
    errorRetryCount: 1,
    errorRetryInterval: 2000,
  }
);

watch(data, (newMovie) => {
  if (newMovie) {
    movie.value = newMovie;
  }
});

const trailerAvailable = computed(() => movie.value.movie.trailer_url);

const loadTrailer = () => (isShowTrailerModal.value = true);

const episodeAvailable = computed(
  () => movie.value.episodes?.[0]?.server_data?.[0]?.slug
);

const loadMovie = () => {
   
  router.push({
    name: "Player",
    params: {
      slugEpisode: reversedEpisodes[0].server_data[0].slug
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
</script>

<template>
  <v-container>
    <v-card v-if="movie">
      <v-row>
        <v-col cols="12" class="background-container d-flex">
          <v-img
            :src="movie.movie.poster_url"
            class="background"
            cover
            position="center"
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
                <v-card-title class="text_green text-h5">{{
                  movie.movie.name
                }}</v-card-title>
                <v-card-title class="mt-n3" style="font-size: 16px">{{
                  movie.movie.origin_name
                }}</v-card-title>
                <v-card-text class="text_dim_gray">{{
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
              <v-col>
                <div>
                  <v-card-title class="text_green text-h5">{{
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
                  <v-card-text class="text_dim_gray">{{
                    movie.movie.content
                  }}</v-card-text>
                  <v-card-action class="d-flex ml-4">
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
              </v-col>
            </v-col>
          </template>
          <trailer-modal
            :isShowTrailerModal="isShowTrailerModal"
            :url="movie.movie.trailer_url"
            @closeTrailerModal="isShowTrailerModal = false"
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
              <v-list-item v-if="episodeAvailable">
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("newEpisode")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col
                    v-for="episode in movie.episodes[0].server_data
                      .slice(-3)
                      .reverse()"
                    :key="episode.slug"
                    cols="2"
                    class="d-flex"
                  >
                    <v-btn
                      color="grey-darken-2"
                      @click="
                        router.push({
                          name: 'Player',
                          params: {
                            slugEpisode: episode.slug,
                          },
                        })
                      "
                      size="small"
                      >{{ episode.name }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("status")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">{{
                      movie.movie.episode_current
                    }}</v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("episodes")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">{{
                      movie.movie.episode_total
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("time")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">{{
                      movie.movie.time
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("genre")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">
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
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">
                      {{ $t("director") }}
                    </v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">
                      <span
                        v-for="(director, index) in movie.movie.director"
                        :key="index"
                      >
                        {{ director ? director : "Đang cập nhật"
                        }}<span v-if="index < movie.movie.director.length - 1"
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
                    <v-list-item-title class="text_size">{{
                      $t("country")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">
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
                    <v-list-item-title class="text_size">{{
                      $t("quality")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">{{
                      movie.movie.quality
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("releaseYear")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">{{
                      movie.movie.year
                    }}</v-list-item-subtitle></v-col
                  >
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row align="center">
                  <v-col cols="4" class="d-flex justify-end">
                    <v-list-item-title class="text_size">{{
                      $t("subtitle")
                    }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8" class="d-flex">
                    <v-list-item-subtitle class="text_size">{{
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

    <v-row v-else>
      <v-progress-circular
        class="animation_loading"
        color="primary"
        indeterminate
      />
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <slot name="fbdiv"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text_green {
  color: #b5e745;
}

.text_dim_gray {
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
  opacity: 0.6;
}

.text_size {
  font-size: 14px;
}

.animation_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
