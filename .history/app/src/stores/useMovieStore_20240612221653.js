import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export const useMovieStore = defineStore('movieStore', {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1',
      singleMovies: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1',
      seriesMovies: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1',
      animes: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1',
      tvShows: 'https://ophim1.com/v1/api/danh-sach/tv-shows?page=1',
    },
  }),
  actions: {
    async getMovies(key) {
      if (!this.apiUrls[key]) {
        return;
      }

      try {
        const { data } = await axios.get(this.apiUrls[key]);
        this.movies[key] = data.items.slice(0, 10);
        console.log(`Data for ${key}: `, data.items);  // Log dữ liệu nhận được
      } catch (error) {
        toast.error('Không thể tải dữ liệu!');
      }
    },
  },
});
