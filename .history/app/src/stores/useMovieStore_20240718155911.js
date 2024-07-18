// useMovieStore.js
import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue3-toastify";
import useSWRV from 'swrv';

export const useSlideMovieStore = defineStore("slideMovieStore", {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: "https://apii.online/apii/danh-sach/phim-moi-cap-nhat?page=1",
      singleMovies: "https://apii.online/apii/danh-sach?type=single&page=1",
      seriesMovies: "https://apii.online/apii/danh-sach?type=series&page=1",
      animes: "https://apii.online/apii/danh-sach?type=hoathinh&page=1",
      tvShows: "https://apii.online/apii/danh-sach?type=tvshows&page=1",
    },
  }),
  actions: {
    async getMovies(key) {
      try {
        const fetcher = async (url) => {
          const {data } = await axios.get(url);
          return data;
        };

        const { data } = useSWRV(this.apiUrls[key], fetcher, {
          revalidateOnFocus: false,
        });
        this.movies[key] = data.value.items.slice(0, 5);
      } catch {
        toast.error("Slide is currently unavailable!");
      }
    },
  },
});
