<template>
  <v-container>
    <v-card v-if="movie">
      <v-row class="background-cover">
        <v-col cols="6" sm="4">
          <v-img
            :src="movie.movie.thumb_url"
            :lazy-src="movie.movie.thumb_url"
          />
        </v-col>
      
        <v-col cols="6" sm="8" class="d-flex flex-column justify-space-between">
          <div>
            <v-card-title class="text-green-light text-h5">{{
              movie.movie.name
            }}</v-card-title>
            <v-card-title class="text-subtitle-1 mt-n3">{{
              movie.movie.origin_name
            }}</v-card-title>
            <v-card-text class="text-dim-gray">{{
              movie.movie.content
            }}</v-card-text>
          </div>
          <v-card-actions class="mb-n2">
            <v-btn
              color="blue-darken-1"
              height="48"
              variant="tonal"
              @click="loadMovie"
              class="mr-2"
            >
              Xem phim
            </v-btn>
            <v-btn
              color="red-darken-1"
              height="48"
              variant="tonal"
              @click="loadTrailer"
            >
              Xem trailer
            </v-btn>
          </v-card-actions>
          <trailer-modal
            :show="isShowTrailer"
            :url="movie.movie.trailer_url"
            @close="isShowTrailer = false"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-list-item>
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Tình trạng:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>{{
                        movie.movie.episode_current
                      }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Số tập:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>{{
                        movie.movie.episode_total
                      }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Thời lượng:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>{{
                        movie.movie.time
                      }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Thể loại:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>
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
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Đạo diễn:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>
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
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Quốc gia:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>
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
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Chất lượng:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>{{
                        movie.movie.quality
                      }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Năm ra mắt:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>{{
                        movie.movie.year
                      }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="d-flex align-center">
                    <v-col cols="4">
                      <v-list-item-title>Phụ đề:</v-list-item-title>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle>{{
                        movie.movie.lang
                      }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>

    <v-row v-else>
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
          :data-href="https://motphimmoi.com/phim/${route.params.slugMovie}"
          data-width="100%"
          data-numposts="5"
        ></div>
      </v-col>
    </v-row>
  </v-container>
</template>
