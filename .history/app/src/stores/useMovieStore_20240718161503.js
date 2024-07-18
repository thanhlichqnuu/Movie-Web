// useMovieStore.js
import { defineStore } from "pinia";

export const useSlideMovieStore = defineStore("slideMovieStore", {
  state: () => ({
    apiKey: {
      movies: "https://apii.online/apii/danh-sach/phim-moi-cap-nhat?page=1",
      singleMovies: "https://apii.online/apii/danh-sach?type=single&page=1",
      seriesMovies: "https://apii.online/apii/danh-sach?type=series&page=1",
      animes: "https://apii.online/apii/danh-sach?type=hoathinh&page=1",
      tvShows: "https://apii.online/apii/danh-sach?type=tvshows&page=1",
    },
  }),
});
