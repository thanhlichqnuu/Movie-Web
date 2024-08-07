import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue3-toastify";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: "https://apii.online/apii/danh-sach/phim-moi-cap-nhat?page=1",
      singleMovies: "https://ophim1.com/v1/api/danh-sach/phim-le?page=1",
      seriesMovies: "https://ophim1.com/v1/api/danh-sach/phim-bo?page=1",
      animes: "https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1",
      tvShows: "https://ophim1.com/v1/api/danh-sach/tv-shows?page=1",
    },
  }),
  actions: {
    async getMovies(key) {
      try {
        const { data } = await axios.get(this.apiUrls[key]);
        const items = key == "movies" ? data.items : data.data.items;
        this.movies[key] = data.slice(0, 5);
      } catch {
        toast.error("Slide is currently unavailable!");
      }
    },
  },
});
