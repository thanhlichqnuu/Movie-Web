import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue3-toastify";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: "https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1",
      singleMovies: "https://ophim1.com/v1/api/danh-sach/phim-le?page=1",
      seriesMovies: "https://ophim1.com/v1/api/danh-sach/phim-bo?page=1",
      animes: "https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1",
      tvShows: "https://ophim1.com/v1/api/danh-sach/tv-shows?page=1",
    },
  }),
  actions: {
    async fetchAllMovies() {
      try {
        const apiCalls = Object.entries(this.apiUrls).map(async ([key, url]) => {
          const { data } = await axios.get(url);
          const items = key === "movies" ? data.items : data.data.items;
          this.movies[key] = items.slice(0, 5);
        });
        await Promise.all(apiCalls);
      } catch {
        toast.error("Slide is currently unavailable!");
      }
    },
  },
});
