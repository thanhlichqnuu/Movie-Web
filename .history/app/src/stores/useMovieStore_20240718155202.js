import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue3-toastify";

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
        const { data } = await axios.get(this.apiUrls[key]);
        this.movies[key] = data.items.slice(0, 5);
      } catch {
        toast.error("Slide is currently unavailable!");
      }
    },
    const fetcher = async (url) => {
      try {
        const { data } = await axios.get(url);
        return data;
      } catch {
        const { toast } = await import("vue3-toastify");
        toast.error("Series list is currently unavailable!");
      }
    };
    
    const { data } = useSWRV(urls, fetcher, {
      refreshInterval: 3600000,
      revalidateOnFocus: false,
      errorRetryCount: 1,
      errorRetryInterval: 2000,
    });
  },
});
